const auth = firebase.auth();
const db = firebase.firestore();

const coursesDiv = document.getElementById("courses");

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  const snapshot = await db.collection("courses").get();
  coursesDiv.innerHTML = "";

  snapshot.forEach(doc => {
    const c = doc.data();
    coursesDiv.innerHTML += `
      <div>
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <video src="${c.videoUrl}" controls width="300"></video>
        <hr>
      </div>
    `;
  });
});

document.getElementById("logoutBtn").onclick = () => {
  auth.signOut().then(() => location.href = "index.html");
};
