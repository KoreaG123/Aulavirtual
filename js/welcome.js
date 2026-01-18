window.requestAccess = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = db.collection("requests").doc(user.uid);
  const snap = await ref.get();

  if (snap.exists) {
    alert("Ya enviaste una solicitud. Espera aprobación.");
    return;
  }

  await ref.set({
    uid: user.uid,
    email: user.email,
    name: user.displayName || "Usuario",
    status: "pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("✅ Solicitud enviada. Te avisaremos cuando seas alumno.");
};
