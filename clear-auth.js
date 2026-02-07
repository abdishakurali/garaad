// Clear all authentication cookies and localStorage
// Run this in the browser console to reset your auth state

// Clear cookies
document.cookie.split(";").forEach((c) => {
    document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// Clear localStorage
localStorage.clear();

// Clear sessionStorage
sessionStorage.clear();

console.log("✅ All cookies and storage cleared!");
console.log("🔄 Refresh the page to start fresh");
