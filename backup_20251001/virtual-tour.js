// virtual-tour.js - Handles the 360° virtual tour functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if the panorama container exists
    const panoElement = document.getElementById('pano');
    if (!panoElement) return;
    
    // Initialize Marzipano viewer
    const viewerOpts = {
        controls: {
            mouseViewMode: 'drag', // Drag to look around
            scrollZoom: true,      // Allow zooming with mouse wheel
        }
    };
    
    const viewer = new Marzipano.Viewer(panoElement, viewerOpts);
    
    // Create source
    const source = Marzipano.ImageUrlSource.fromString(
        // Using a sample 360° image from Marzipano's examples
        // In a real application, replace with your own 360° images
        'https://www.marzipano.net/media/equirect/angra.jpg'
    );
    
    // Create geometry
    const geometry = new Marzipano.EquirectGeometry([
        { width: 4000 },
        { width: 3000 },
        { width: 2000 },
        { width: 1000 }
    ]);
    
    // Create view with initial parameters
    const limiter = Marzipano.util.compose(
        Marzipano.FixedFovInput.limit.vfov(0.1, Math.PI/2),  // Limit vertical field of view
        Marzipano.FixedFovInput.limit.hfov(0.1, Math.PI)     // Limit horizontal field of view
    );
    
    const view = new Marzipano.RectilinearView(
        { yaw: Math.PI/4 },  // Initial yaw (horizontal rotation)
        { 
            fov: Math.PI/2,  // Initial field of view
            minFov: Math.PI/4,
            maxFov: Math.PI/2
        },
        limiter
    );
    
    // Create scene
    const scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true
    });
    
    // Display the scene
    scene.switchTo();
    
    // Add hotspots
    addHotspots(scene);
    
    // Setup controls
    setupControls(viewer, scene);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        viewer.updateSize();
    });
    
    // Auto-rotation
    let autoRotateTimer;
    let isAutoRotating = false;
    
    function startAutoRotate() {
        if (isAutoRotating) return;
        
        isAutoRotating = true;
        document.getElementById('auto-rotate-btn').classList.add('active');
        
        function rotate() {
            const currentYaw = view.yaw();
            view.setYaw(currentYaw + 0.002);
            viewer.lookTo(view.parameters());
            autoRotateTimer = requestAnimationFrame(rotate);
        }
        
        rotate();
    }
    
    function stopAutoRotate() {
        if (!isAutoRotating) return;
        
        isAutoRotating = false;
        document.getElementById('auto-rotate-btn').classList.remove('active');
        cancelAnimationFrame(autoRotateTimer);
    }
    
    // Toggle auto-rotation
    document.getElementById('auto-rotate-btn').addEventListener('click', function() {
        if (isAutoRotating) {
            stopAutoRotate();
        } else {
            startAutoRotate();
        }
    });
    
    // Fullscreen toggle
    document.getElementById('fullscreen-btn').addEventListener('click', function() {
        if (!document.fullscreenElement) {
            panoElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
    
    // VR mode (if supported)
    const vrButton = document.getElementById('vr-btn');
    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-vr').then(supported => {
            if (supported) {
                vrButton.style.display = 'flex';
                vrButton.addEventListener('click', function() {
                    alert('VR mode would be enabled here in a production environment.');
                    // In a real implementation, you would initialize WebXR here
                });
            } else {
                vrButton.style.display = 'none';
            }
        });
    } else {
        vrButton.style.display = 'none';
    }
});

// Add hotspots to the scene
function addHotspots(scene) {
    // Define hotspot positions (yaw, pitch, distance)
    const hotspots = [
        { yaw: 0.5, pitch: 0, distance: 1, id: 'storage' },
        { yaw: 1.5, pitch: 0.2, distance: 1, id: 'packing' },
        { yaw: 2.5, pitch: -0.1, distance: 1, id: 'loading' },
        { yaw: 3.5, pitch: 0.1, distance: 1, id: 'quality' }
    ];
    
    // Create hotspot elements
    hotspots.forEach(hotspot => {
        const element = document.createElement('div');
        element.className = 'hotspot';
        element.dataset.hotspotId = hotspot.id;
        
        // Create icon
        const icon = document.createElement('i');
        const icons = {
            'storage': 'fa-pallet',
            'packing': 'fa-box-open',
            'loading': 'fa-truck-loading',
            'quality': 'fa-check-circle'
        };
        
        icon.className = `fas ${icons[hotspot.id]}`;
        element.appendChild(icon);
        
        // Add click handler
        element.addEventListener('click', function(e) {
            e.stopPropagation();
            showHotspotInfo(hotspot.id);
        });
        
        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'hotspot-tooltip';
        tooltip.textContent = formatHotspotName(hotspot.id);
        element.appendChild(tooltip);
        
        // Create hotspot in the scene
        const position = { yaw: hotspot.yaw, pitch: hotspot.pitch };
        const distance = hotspot.distance || 1;
        
        scene.hotspotContainer().createHotspot(element, { yaw: position.yaw, pitch: position.pitch }, distance);
    });
}

// Format hotspot ID for display
function formatHotspotName(id) {
    return id.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Setup viewer controls
function setupControls(viewer, scene) {
    // Add keyboard controls
    document.addEventListener('keydown', function(e) {
        const moveAmount = 0.1;
        const currentYaw = scene.view().yaw();
        const currentPitch = scene.view().pitch();
        const currentFov = scene.view().fov();
        
        switch (e.key) {
            case 'ArrowLeft':
                scene.view().setYaw(currentYaw - moveAmount);
                break;
            case 'ArrowRight':
                scene.view().setYaw(currentYaw + moveAmount);
                break;
            case 'ArrowUp':
                scene.view().setPitch(Math.min(currentPitch + moveAmount, Math.PI/2 - 0.1));
                break;
            case 'ArrowDown':
                scene.view().setPitch(Math.max(currentPitch - moveAmount, -Math.PI/2 + 0.1));
                break;
            case '+':
                scene.view().setFov(Math.max(currentFov * 0.9, Math.PI/4));
                break;
            case '-':
                scene.view().setFov(Math.min(currentFov * 1.1, Math.PI/2));
                break;
        }
        
        viewer.lookTo(scene.view().parameters());
    });
}

// Show hotspot information
function showHotspotInfo(hotspotId) {
    const hotspotInfo = document.getElementById('hotspot-info');
    const hotspotTitle = document.getElementById('hotspot-title');
    const hotspotDesc = document.getElementById('hotspot-description');
    
    const info = {
        'storage': {
            title: 'Storage Area',
            description: 'Our climate-controlled storage area ensures that all products are kept in optimal conditions. We maintain strict temperature and humidity controls to preserve product quality.'
        },
        'packing': {
            title: 'Packing Station',
            description: 'Our dedicated packing area is where orders are carefully prepared for shipment. We use high-quality packaging materials to ensure your products arrive in perfect condition.'
        },
        'loading': {
            title: 'Loading Bay',
            description: 'The loading bay is where orders are efficiently loaded onto our delivery vehicles. Our organized system ensures quick and accurate order fulfillment.'
        },
        'quality': {
            title: 'Quality Control',
            description: 'Every product undergoes rigorous quality checks before being shipped. Our quality control team ensures that only the best products reach our customers.'
        }
    };
    
    if (info[hotspotId]) {
        hotspotTitle.textContent = info[hotspotId].title;
        hotspotDesc.textContent = info[hotspotId].description;
        hotspotInfo.classList.add('active');
        
        // Update active state in the hotspot grid
        document.querySelectorAll('.hotspot-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.hotspot-item[data-hotspot="${hotspotId}"]`)?.classList.add('active');
    }
}
