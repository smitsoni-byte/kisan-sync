import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  deleteDoc, 
  onSnapshot, 
  getDocFromServer,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { CropListing, UserProfile, ActivityItem, Bid, MarketplaceOrder, UserLoginRecord, FarmerCropScanRecord, CropAnalysisResult } from '../types';

// Web app's Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyCLY5p3PD3wg8GspUoKEBCsza-_wVOQlsM",
  authDomain: "kisan-sync-dde64.firebaseapp.com",
  projectId: "kisan-sync-dde64",
  storageBucket: "kisan-sync-dde64.firebasestorage.app",
  messagingSenderId: "768721210050",
  appId: "1:768721210050:web:8ba441fd994db4cc33495b"
};

// Initialize Firebase safely (avoid multiple initializations in dev/HMR)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard Firebase Firestore Error Handler
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn(`[Firebase Error: ${operationType} on ${path}]`, errInfo.error);
}

/**
 * Recursively sanitizes any payload destined for Firestore by omitting any fields with `undefined` values.
 * Firestore strictly rejects documents containing `undefined` values.
 */
export function removeUndefinedFields<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => removeUndefinedFields(item)) as any;
  }
  if (typeof data === 'object') {
    if (data instanceof Date) {
      return data;
    }
    const proto = Object.getPrototypeOf(data);
    if (proto !== null && proto !== Object.prototype) {
      // Retain custom instances such as Firestore FieldValue sentinels (serverTimestamp, deleteField, etc.)
      return data;
    }
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefinedFields(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

/**
 * Safe setDoc wrapper that guarantees no `undefined` values are sent to Firestore.
 */
export async function safeSetDoc(docRef: any, data: any, options?: any) {
  const cleanedData = removeUndefinedFields(data);
  return options !== undefined ? setDoc(docRef, cleanedData, options) : setDoc(docRef, cleanedData);
}

// Test live Firestore server connectivity
export async function testFirebaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const testDocRef = doc(db, '_connection_test', 'ping');
    await getDocFromServer(testDocRef);
    return { success: true, message: `Connected to Firebase (${firebaseConfig.projectId})` };
  } catch (error: any) {
    if (error?.message?.includes('the client is offline') || error?.code === 'unavailable') {
      return { success: false, message: 'Firebase client is currently offline. Operating in local cache mode.' };
    }
    // If doc doesn't exist, try writing a harmless ping
    try {
      await setDoc(doc(db, '_connection_test', 'ping'), { 
        lastPing: new Date().toISOString(),
        service: 'KisanSync APMC Exchange',
        projectId: firebaseConfig.projectId
      });
      return { success: true, message: `Successfully connected to Firebase (${firebaseConfig.projectId})` };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Firestore connection check returned warning.' };
    }
  }
}

// ==========================================
// AUTHENTICATION HELPERS
// ==========================================

export async function signInWithGoogle(): Promise<{ user: FirebaseUser | null; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (error: any) {
    return { user: null, error: error?.message || 'Google sign-in was cancelled or failed.' };
  }
}

export async function signOutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// ==========================================
// FIRESTORE: CROP LISTINGS
// ==========================================

export function subscribeToListings(onUpdate: (listings: CropListing[]) => void): () => void {
  const listingsRef = collection(db, 'listings');
  return onSnapshot(
    listingsRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const remoteListings: CropListing[] = [];
        snapshot.forEach((docSnap) => {
          remoteListings.push(docSnap.data() as CropListing);
        });
        onUpdate(remoteListings);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'listings');
    }
  );
}

export async function saveListingToFirestore(listing: CropListing): Promise<void> {
  try {
    const docRef = doc(db, 'listings', listing.id);
    await safeSetDoc(docRef, listing, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `listings/${listing.id}`);
    throw error;
  }
}

export async function saveBidToFirestore(cropId: string, bid: Bid, currentHighest: number, bidCount: number, bidsHistory: Bid[]): Promise<void> {
  try {
    const docRef = doc(db, 'listings', cropId);
    await safeSetDoc(docRef, {
      currentHighestBid: currentHighest,
      bidCount: bidCount,
      bidsHistory: bidsHistory
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `listings/${cropId}`);
    throw error;
  }
}

// ==========================================
// FIRESTORE: USER ACCOUNTS & PROFILES
// ==========================================

export function subscribeToAccounts(onUpdate: (accounts: UserProfile[]) => void): () => void {
  const usersRef = collection(db, 'users');
  return onSnapshot(
    usersRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const remoteAccounts: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          remoteAccounts.push(docSnap.data() as UserProfile);
        });
        onUpdate(remoteAccounts);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'users');
    }
  );
}

export async function saveAccountToFirestore(account: UserProfile): Promise<void> {
  try {
    const docRef = doc(db, 'users', account.id);
    await safeSetDoc(docRef, {
      ...account,
      email: account.email || '',
      phone: account.phone || '',
      notes: account.notes || '',
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${account.id}`);
    throw error;
  }
}

export async function blockAccountInFirestore(accountId: string, reason: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', accountId);
    await safeSetDoc(docRef, {
      status: 'Blocked',
      isBlocked: true,
      blockReason: reason,
      blockedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${accountId}`);
    throw error;
  }
}

export async function unblockAccountInFirestore(accountId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', accountId);
    await safeSetDoc(docRef, {
      status: 'Active',
      isBlocked: false,
      blockReason: null,
      blockedAt: null
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${accountId}`);
    throw error;
  }
}

export async function deleteAccountFromFirestore(accountId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', accountId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${accountId}`);
    throw error;
  }
}

// ==========================================
// FIRESTORE: ACTIVITIES & TRANSACTIONS
// ==========================================

export async function addActivityToFirestore(activity: ActivityItem): Promise<void> {
  try {
    const docRef = doc(db, 'activities', activity.id);
    await safeSetDoc(docRef, activity, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `activities/${activity.id}`);
  }
}

export function subscribeToActivities(onUpdate: (activities: ActivityItem[]) => void): () => void {
  const activitiesRef = collection(db, 'activities');
  return onSnapshot(
    activitiesRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: ActivityItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as ActivityItem);
        });
        onUpdate(list);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'activities');
    }
  );
}

// ==========================================
// FIRESTORE: USER LOGINS LOGGING
// ==========================================

export async function recordUserLoginToFirestore(user: UserProfile, method: string = 'Credentials'): Promise<void> {
  try {
    const loginId = `login_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const loginRecord: UserLoginRecord = {
      id: loginId,
      loginId: loginId,
      userId: user.id,
      userName: user.name || 'User',
      userEmail: user.email || '',
      userPhone: user.phone || '',
      role: user.role || 'Farmer',
      location: user.location || 'Gujarat, India',
      loginMethod: method,
      method: method,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Web Browser',
      timestamp: new Date().toISOString(),
    };

    // 1. Save to primary user_logins collection
    const loginDocRef = doc(db, 'user_logins', loginId);
    await safeSetDoc(loginDocRef, {
      ...loginRecord,
      createdAt: serverTimestamp(),
    });

    // 2. Save specifically to role-segregated collection (farmers vs buyers)
    const normalizedRole = (user.role || '').toLowerCase();
    if (normalizedRole === 'farmer') {
      const farmerLoginDocRef = doc(db, 'farmer_logins', loginId);
      await safeSetDoc(farmerLoginDocRef, {
        ...loginRecord,
        farmerSpecificId: user.id,
        createdAt: serverTimestamp(),
      });
    } else if (normalizedRole === 'buyer' || normalizedRole === 'trader') {
      const buyerLoginDocRef = doc(db, 'buyer_logins', loginId);
      await safeSetDoc(buyerLoginDocRef, {
        ...loginRecord,
        buyerSpecificId: user.id,
        createdAt: serverTimestamp(),
      });
    }

    // 3. Also update/sync user's master record with lastLogin info
    const userDocRef = doc(db, 'users', user.id);
    await safeSetDoc(
      userDocRef,
      {
        ...user,
        email: user.email || '',
        phone: user.phone || '',
        lastLoginAt: new Date().toISOString(),
        lastLoginMethod: method,
      },
      { merge: true }
    );

    console.info(`[Firebase] User login recorded in database for ${user.name} (${user.role} - ${user.id})`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'user_logins');
  }
}

export function subscribeToUserLogins(onUpdate: (logins: UserLoginRecord[]) => void): () => void {
  const loginsRef = collection(db, 'user_logins');
  return onSnapshot(
    loginsRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: UserLoginRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as UserLoginRecord);
        });
        // Sort descending by timestamp/createdAt
        list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
        onUpdate(list);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'user_logins');
    }
  );
}

export function subscribeToFarmerLogins(onUpdate: (logins: UserLoginRecord[]) => void): () => void {
  const loginsRef = collection(db, 'farmer_logins');
  return onSnapshot(
    loginsRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: UserLoginRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as UserLoginRecord);
        });
        list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
        onUpdate(list);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'farmer_logins');
    }
  );
}

export function subscribeToBuyerLogins(onUpdate: (logins: UserLoginRecord[]) => void): () => void {
  const loginsRef = collection(db, 'buyer_logins');
  return onSnapshot(
    loginsRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: UserLoginRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as UserLoginRecord);
        });
        list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
        onUpdate(list);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'buyer_logins');
    }
  );
}

// ==========================================
// FIRESTORE: FARMER CROP SCANS & DIAGNOSTICS
// ==========================================

export async function recordCropScanToFirestore(
  scan: CropAnalysisResult,
  farmer?: UserProfile | null
): Promise<void> {
  try {
    const scanId = scan.id || `scan_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const farmerName = farmer?.name || (scan as any).farmerName || 'Kisan Farmer';
    const farmerId = farmer?.id || 'farmer_guest';
    const farmerLocation = farmer?.location || 'Gujarat, India';
    const farmerPhone = farmer?.phone || '';

    const scanRecord: FarmerCropScanRecord = {
      id: scanId,
      scanId: scanId,
      farmerId: farmerId,
      farmerName: farmerName,
      farmerLocation: farmerLocation,
      farmerPhone: farmerPhone,
      cropType: scan.cropType,
      subjectIdentification: scan.subjectIdentification || scan.cropType,
      healthStatus: scan.healthStatus,
      diseaseDetected: scan.diseaseDetected || 'Healthy / No Disease',
      confidenceScore: scan.confidenceScore || 95,
      qualityGrade: scan.qualityGrade || 'A',
      aiQualityScore: scan.aiQualityScore || 90,
      primarySymptomsObserved: scan.primarySymptomsObserved || [],
      summaryAdvice: scan.summaryAdvice || '',
      organicTreatment: scan.detailedAdvice?.organicTreatment || [],
      chemicalTreatment: scan.detailedAdvice?.chemicalTreatment || [],
      preventativeMeasures: scan.detailedAdvice?.preventativeMeasures || [],
      severity: scan.detailedAdvice?.severity || 'Low',
      estimatedYieldImpact: scan.detailedAdvice?.estimatedYieldImpact || 'None',
      marketEligibility: scan.marketEligibility || 'Grade A',
      timestamp: new Date().toISOString(),
    };

    // Save to crop_scans collection
    const scanDocRef = doc(db, 'crop_scans', scanId);
    await safeSetDoc(scanDocRef, {
      ...scanRecord,
      createdAt: serverTimestamp(),
    });

    // Also record in farmer_scans collection for farmer queries
    const farmerScanRef = doc(db, 'farmer_scans', scanId);
    await safeSetDoc(farmerScanRef, {
      ...scanRecord,
      createdAt: serverTimestamp(),
    });

    // Also write to audit activities
    await addActivityToFirestore({
      id: `act_${Date.now()}`,
      type: 'analysis',
      title: `Crop Scanned: ${scan.cropType} (${scan.diseaseDetected ? scan.diseaseDetected : 'Healthy'})`,
      description: `Farmer: ${farmerName} (${farmerLocation}) scanned ${scan.cropType}. Status: ${scan.healthStatus}, Score: ${scan.aiQualityScore || 90}/100.`,
      timestamp: 'Just Now',
      statusBadge: scan.diseaseDetected ? 'Treatment Prescribed' : 'Healthy Canopy',
    });

    console.info(`[Firebase] Crop diagnostic scan saved to Firestore: ${scanId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `crop_scans/${scan.id}`);
  }
}

export function subscribeToCropScans(onUpdate: (scans: FarmerCropScanRecord[]) => void): () => void {
  const scansRef = collection(db, 'crop_scans');
  return onSnapshot(
    scansRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: FarmerCropScanRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as FarmerCropScanRecord);
        });
        list.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
        onUpdate(list);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'crop_scans');
    }
  );
}

// ==========================================
// FIRESTORE: MARKETPLACE TRANSACTIONS & ORDERS
// ==========================================

export async function recordMarketplaceOrderToFirestore(order: MarketplaceOrder): Promise<void> {
  try {
    const orderWithAliases: MarketplaceOrder = {
      ...order,
      farmerAddress: order.farmerAddress || order.farmerSellerAddress,
      paymentStatus: order.paymentStatus || order.status || 'Confirmed',
      orderDate: order.orderDate || order.timestamp || new Date().toISOString(),
    };

    const orderDocRef = doc(db, 'marketplace_orders', order.orderId);
    await safeSetDoc(orderDocRef, {
      ...orderWithAliases,
      createdAt: serverTimestamp(),
    });

    // Also record an audit activity item in activities collection
    const actId = `act_order_${Date.now()}`;
    await addActivityToFirestore({
      id: actId,
      type: 'payout',
      title: `Trade Finalized: ${order.cropName} (${order.quantitySoldQuintals} Qtl)`,
      description: `Buyer: ${order.buyerName} (${order.buyerAddress}) purchased from Farmer: ${order.farmerSellerName} (${order.farmerSellerAddress}) at ₹${order.pricePerQuintal.toLocaleString('en-IN')}/Qtl (Total: ₹${order.totalPrice.toLocaleString('en-IN')})`,
      timestamp: 'Just Now',
      amount: order.totalPrice,
      statusBadge: 'Order Completed',
    });

    console.info(`[Firebase] Marketplace order saved to Firestore: ${order.orderId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `marketplace_orders/${order.orderId}`);
    throw error;
  }
}

export function subscribeToMarketplaceOrders(onUpdate: (orders: MarketplaceOrder[]) => void): () => void {
  const ordersRef = collection(db, 'marketplace_orders');
  return onSnapshot(
    ordersRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: MarketplaceOrder[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as MarketplaceOrder);
        });
        // Sort descending by timestamp/orderDate
        list.sort((a, b) => ((b.timestamp || b.orderDate || '') > (a.timestamp || a.orderDate || '') ? 1 : -1));
        onUpdate(list);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'marketplace_orders');
    }
  );
}

export async function recordMarketplaceBidToFirestore(
  crop: CropListing,
  bid: Bid,
  buyerAddress?: string,
  buyerPhone?: string
): Promise<void> {
  try {
    // 1. Update listing document
    const updatedHistory = [bid, ...(crop.bidsHistory || []).map((b) => ({ ...b, isHighest: false }))];
    const cropDocRef = doc(db, 'listings', crop.id);
    await safeSetDoc(
      cropDocRef,
      {
        currentHighestBid: bid.amount,
        bidCount: (crop.bidCount || 0) + 1,
        bidsHistory: updatedHistory,
      },
      { merge: true }
    );

    // 2. Save individual bid record to marketplace_bids
    const bidDocRef = doc(db, 'marketplace_bids', bid.id);
    await safeSetDoc(bidDocRef, {
      bidId: bid.id,
      cropId: crop.id,
      cropName: crop.cropName,
      variety: crop.variety,
      farmerSellerName: crop.farmerName,
      farmerSellerAddress: crop.farmerLocation,
      buyerName: bid.buyerName,
      buyerAddress: buyerAddress || bid.buyerLocation || 'Gujarat, India',
      buyerPhone: buyerPhone || '',
      pricePerQuintal: bid.amount,
      quantityQuintals: crop.quantityQuintals,
      estimatedTotalValue: bid.amount * crop.quantityQuintals,
      timestamp: bid.timestamp,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `marketplace_bids/${bid.id}`);
  }
}

