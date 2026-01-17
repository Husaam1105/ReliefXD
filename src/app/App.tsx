import { useState, useCallback, useMemo, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { AdminTableView } from './components/AdminTableView';
import { LoginModal } from './components/LoginModal';
import { Incident, AIAnalysisResult, UrgencyLevel, CategoryType } from './types/incident';

// --- FIREBASE IMPORTS ---
import { db } from './firebase'; // Import the db instance we created
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';

const CURRENT_USER_ID = 'user-1';

/* ================= BACKEND API ================= */
// Kept exactly as you had it
const analyzeWithBackend = async (
  description: string
): Promise<AIAnalysisResult> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });

  if (!res.ok) {
    throw new Error('Backend analysis failed');
  }

  return res.json();
};

/* ================= RANDOM LOCATION (DEMO ONLY) ================= */
const generateRandomLocation = () => ({
  lat: (Math.random() * 160) - 80,
  lng: (Math.random() * 360) - 180,
});

export default function App() {
  // Initialize with empty array, data will come from Firestore
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [isAiMaximized, setIsAiMaximized] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] =
    useState<'detecting' | 'detected' | 'denied' | 'unavailable'>('detecting');

  /* ================= FIRESTORE SYNC ================= */
  // This useEffect replaces your sampleIncidents
  useEffect(() => {
    // Query incidents collection, ordered by latest first
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"));

    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedIncidents = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to JS Date
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(),
        } as Incident;
      });
      setIncidents(fetchedIncidents);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  /* ================= GEOLOCATION ================= */
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setUserLocation(generateRandomLocation());
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus('detected');
      },
      () => {
        setLocationStatus('denied');
        setUserLocation(generateRandomLocation());
      },
      { enableHighAccuracy: true }
    );
  }, []);

  /* ================= ANALYZE REQUEST ================= */
  const handleAnalyze = useCallback(async (description: string) => {
    if (!userLocation) {
      alert('Waiting for location detection. Please try again.');
      return;
    }

    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    try {
      // 1. Analyze with your Python/Node backend
      const result = await analyzeWithBackend(description);
      setCurrentAnalysis(result);

      // 2. Prepare data for Firestore
      // Note: We don't manually add 'id', Firestore generates it
      const newIncidentData = {
        description,
        urgency: result.urgency.toLowerCase(),
        category: result.category.toLowerCase(),
        summary: result.summary,
        resources: result.resources,
        confidence: Math.round(result.confidence * 100),
        location: userLocation,
        timestamp: serverTimestamp(), // Use server time for consistency
        userId: CURRENT_USER_ID,
      };

      // 3. Write to Firestore
      await addDoc(collection(db, "incidents"), newIncidentData);

      // Note: We do NOT need to setIncidents here manually.
      // The onSnapshot in the useEffect will detect the change and update the UI automatically.

    } catch (err) {
      console.error('Error processing incident:', err);
      alert('Service unavailable or Database Error');
    } finally {
      setIsAnalyzing(false);
    }
  }, [userLocation]);

  /* ================= ACTION HANDLERS ================= */
  const handleDeleteIncident = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await deleteDoc(doc(db, "incidents", id));
        // No need to manual filter, snapshot listener will handle it
        if (selectedIncident?.id === id) {
          setSelectedIncident(null);
        }
      } catch (error) {
        console.error("Error deleting incident:", error);
        alert("Failed to delete incident");
      }
    }
  }, [selectedIncident]);

  const handleViewOnMap = useCallback((incident: Incident) => {
    setActiveTab('dashboard');
    setSelectedIncident(incident);
    setIsAiMaximized(false); // Ensure map is visible
  }, []);

  const handleViewDetails = useCallback((incident: Incident) => {
    setActiveTab('dashboard');
    setSelectedIncident(incident);
    setIsAiMaximized(true); // Open in customized AI Focus Mode
  }, []);

  /* ================= FILTERING ================= */
  const filteredIncidents = useMemo(() => {
    return isAdmin
      ? incidents
      : incidents.filter((i) => i.userId === CURRENT_USER_ID);
  }, [incidents, isAdmin]);

  /* ================= STATS ================= */
  const criticalCount = filteredIncidents.filter(i => i.urgency === 'critical').length;
  const highCount = filteredIncidents.filter(i => i.urgency === 'high').length;
  const mediumCount = filteredIncidents.filter(i => i.urgency === 'medium').length;
  const lowCount = filteredIncidents.filter(i => i.urgency === 'low').length;
  const safeCount = filteredIncidents.filter(i => i.urgency === 'safe').length;

  const avgConfidence =
    filteredIncidents.length > 0
      ? Math.round(
        filteredIncidents.reduce((sum, i) => sum + i.confidence, 0) /
        filteredIncidents.length
      )
      : 0;

  return (
    <>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
        onLoginClick={() => setIsLoginModalOpen(true)}
      >
        {activeTab === 'dashboard' ? (
          <DashboardView
            criticalCount={criticalCount}
            highCount={highCount}
            mediumCount={mediumCount}
            lowCount={lowCount}
            safeCount={safeCount}
            avgConfidence={avgConfidence}
            incidents={filteredIncidents}
            onIncidentClick={setSelectedIncident}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            currentAnalysis={currentAnalysis}
            locationStatus={locationStatus}
            userLocation={userLocation}
            onLocationUpdate={setUserLocation}
            isAiMaximized={isAiMaximized}
            onToggleAiMaximized={() => setIsAiMaximized(!isAiMaximized)}
          />
        ) : (
          isAdmin ? (
            <AdminTableView
              incidents={incidents}
              onDelete={handleDeleteIncident}
              onViewOnMap={handleViewOnMap}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <HistoryView
              incidents={filteredIncidents}
              onDelete={handleDeleteIncident}
              onViewOnMap={handleViewOnMap}
              onViewDetails={handleViewDetails}
            />
          )
        )}
      </Layout>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={(role) => setIsAdmin(role === 'admin')}
      />
    </>
  );
}