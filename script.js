function enterSite() {
    // Request device orientation permission for iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                // if granted, gyroscope event listener will work
            })
            .catch(console.error);
    }

    const enterScreen = document.getElementById('enter-screen');
    if (enterScreen) {
        enterScreen.classList.add('fade-out');
        setTimeout(() => { enterScreen.style.display = 'none'; }, 800);
    }

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('visible');
    }

    const credit = document.querySelector('.vibecode-credit');
    if (credit) {
        credit.classList.add('visible');
    }

    const video = document.getElementById('bg-video');
    const audio = document.getElementById('bg-audio');
    
    if (video) {
        video.currentTime = 0; // Restart video
        video.play().catch(e => console.log(e));
    }
    
    if (audio) {
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play blocked:", e));
    }

    const nameEl = document.getElementById('name-scramble');
    if (nameEl) {
        let isCuway = false;
        setInterval(() => {
            if (isCuway) {
                scrambleText(nameEl, "Cuway", "Dinh Trong", 1500);
            } else {
                scrambleText(nameEl, "Dinh Trong", "Cuway", 1500);
            }
            isCuway = !isCuway;
        }, 4500);
    }
}



function scrambleText(element, oldText, newText, duration) {
    const chars = '!<>-_\\/[]{}—=+*^?#_@ABCDEFXYZ';
    const startTime = Date.now();
    let interval = setInterval(() => {
        let elapsed = Date.now() - startTime;
        let progress = elapsed / duration;
        
        if (progress >= 1) {
            element.innerText = newText;
            element.setAttribute('data-text', newText);
            clearInterval(interval);
            return;
        }
        
        let result = "";
        let maxLen = Math.max(oldText.length, newText.length);
        for (let i = 0; i < maxLen; i++) {
            let threshold = i / maxLen;
            if (progress > threshold) {
                result += newText[i] || "";
            } else if (progress < threshold - 0.2) {
                result += oldText[i] || "";
            } else {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        element.innerText = result;
        element.setAttribute('data-text', result);
    }, 50);
}


// Card Tilt Tracking
(function() {
    window.addEventListener('mousemove', (e) => {
        // Tilt effect for the entire card
        const mainContent = document.querySelector('.main-content');
        if (mainContent && mainContent.classList.contains('visible') && window.innerWidth > 768) {
            let xAxis = (window.innerWidth / 2 - e.clientX) / 40; 
            let yAxis = (window.innerHeight / 2 - e.clientY) / 40;
            mainContent.style.transform = `perspective(1000px) scale(1) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
    });

    window.addEventListener('mouseleave', () => {
        const mainContent = document.querySelector('.main-content');
        if (mainContent && mainContent.classList.contains('visible')) {
            mainContent.style.transform = `perspective(1000px) scale(1) rotateY(0deg) rotateX(0deg)`;
        }
    });

    // Mobile gyroscope tilt effect
    window.addEventListener('deviceorientation', (event) => {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent || !mainContent.classList.contains('visible') || window.innerWidth > 768) return;
        
        let gamma = event.gamma; 
        let beta = event.beta;   
        
        if (gamma === null || beta === null) return;
        
        if (gamma > 45) gamma = 45;
        if (gamma < -45) gamma = -45;
        
        let betaOffset = beta - 45;
        if (betaOffset > 45) betaOffset = 45;
        if (betaOffset < -45) betaOffset = -45;
        
        let xAxis = gamma / 2;
        let yAxis = -betaOffset / 2;
        
        mainContent.style.transform = `perspective(1000px) scale(1) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
})();

// Initialize Ghost Cursor if cursor_effects is loaded
window.addEventListener('load', () => {
    if (typeof cursoreffects !== 'undefined' && cursoreffects.ghostCursor) {
        cursoreffects.ghostCursor();
    }
});
