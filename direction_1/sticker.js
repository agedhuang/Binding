document.addEventListener("DOMContentLoaded", () => {
    const sticker = document.querySelector(".sticker");
    if (!sticker) return;

    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    // Add cursor style
    sticker.style.cursor = "grab";

    function initDrag(e) {
        if (e.type === "mousedown" && e.button !== 0) return; // Only left mouse button

        e.preventDefault();

        isDragging = true;
        sticker.style.cursor = "grabbing";

        // Get pointer position
        if (e.type === "touchstart") {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else {
            startX = e.clientX;
            startY = e.clientY;
        }

        // Get current layout position to avoid jump with CSS transforms
        const currentLeft = sticker.offsetLeft;
        const currentTop = sticker.offsetTop;

        // Switch to explicit left/top and disable right/bottom to allow free movement
        sticker.style.right = "auto";
        sticker.style.bottom = "auto";
        sticker.style.left = currentLeft + "px";
        sticker.style.top = currentTop + "px";

        initialLeft = currentLeft;
        initialTop = currentTop;

        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", endDrag);
        document.addEventListener("touchmove", onDrag, { passive: false });
        document.addEventListener("touchend", endDrag);
    }

    function onDrag(e) {
        if (!isDragging) return;

        let clientX, clientY;
        if (e.type === "touchmove") {
            e.preventDefault();
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const dx = clientX - startX;
        const dy = clientY - startY;

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Simplified Boundary Check
        // Allow partial off-screen to avoid snapping hard if rotated
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const w = sticker.offsetWidth;
        const h = sticker.offsetHeight;

        // Constrain so at least half the sticker is visible roughly
        if (newLeft < -w/2) newLeft = -w/2;
        if (newLeft > winW - w/2) newLeft = winW - w/2;
        if (newTop < -h/2) newTop = -h/2;
        if (newTop > winH - h/2) newTop = winH - h/2;

        sticker.style.left = newLeft + "px";
        sticker.style.top = newTop + "px";
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        sticker.style.cursor = "grab";

        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", endDrag);
        document.removeEventListener("touchmove", onDrag);
        document.removeEventListener("touchend", endDrag);
    }

    sticker.addEventListener("mousedown", initDrag);
    sticker.addEventListener("touchstart", initDrag, { passive: false });
});
