const camera = document.getElementById("camera");
const cameraBtn = document.getElementById("cameraBtn");
const cameraMessage = document.getElementById("cameraMessage");
const furnitureLayer = document.getElementById("furnitureLayer");

const roomType = document.getElementById("roomType");
const styleType = document.getElementById("styleType");
const budget = document.getElementById("budget");

const rotateBtn = document.getElementById("rotateBtn");
const increaseBtn = document.getElementById("increaseBtn");
const decreaseBtn = document.getElementById("decreaseBtn");
const deleteBtn = document.getElementById("deleteBtn");
const saveBtn = document.getElementById("saveBtn");

let stream = null;
let selectedFurniture = null;
let furnitureCount = 0;

const furnitureData = {
    sofa: {
        icon: "🛋️",
        name: "Sofa"
    },
    table: {
        icon: "🪑",
        name: "Table"
    },
    chair: {
        icon: "💺",
        name: "Chair"
    },
    lamp: {
        icon: "💡",
        name: "Lamp"
    },
    bed: {
        icon: "🛏️",
        name: "Bed"
    },
    plant: {
        icon: "🪴",
        name: "Plant"
    }
};

/* CAMERA */

cameraBtn.addEventListener("click", async () => {

    if (stream) {
        stopCamera();
        return;
    }

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            },
            audio: false
        });

        camera.srcObject = stream;
        camera.style.display = "block";
        cameraMessage.style.display = "none";

        cameraBtn.textContent = "Stop Camera";

    } catch (error) {

        alert(
            "Camera access was not available. Please allow camera permission and try again."
        );

        console.error(error);
    }
});

function stopCamera() {

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    camera.style.display = "none";
    cameraMessage.style.display = "flex";
    cameraBtn.textContent = "Start Camera";
}

/* ADD FURNITURE */

document.querySelectorAll(".furniture-btn").forEach(button => {

    button.addEventListener("click", () => {

        const item = button.dataset.item;

        addFurniture(item);

    });

});

function addFurniture(item) {

    const data = furnitureData[item];

    const object = document.createElement("div");

    object.className = "furniture-object";
    object.textContent = data.icon;
    object.dataset.item = item;

    object.style.left =
        `${25 + Math.random() * 45}%`;

    object.style.top =
        `${25 + Math.random() * 40}%`;

    object.dataset.scale = "1";
    object.dataset.rotation = "0";

    furnitureLayer.appendChild(object);

    furnitureCount++;

    selectFurniture(object);

    makeDraggable(object);

    updateRecommendations();
}

/* SELECT */

function selectFurniture(object) {

    document.querySelectorAll(".furniture-object").forEach(item => {
        item.classList.remove("selected");
    });

    object.classList.add("selected");

    selectedFurniture = object;
}

furnitureLayer.addEventListener("click", event => {

    const object = event.target.closest(".furniture-object");

    if (object) {
        selectFurniture(object);
    }

});

/* DRAG */

function makeDraggable(object) {

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    object.addEventListener("pointerdown", event => {

        dragging = true;

        const rect = object.getBoundingClientRect();

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        object.setPointerCapture(event.pointerId);

        selectFurniture(object);
    });

    object.addEventListener("pointermove", event => {

        if (!dragging) return;

        const containerRect =
            furnitureLayer.getBoundingClientRect();

        let x =
            event.clientX -
            containerRect.left -
            offsetX;

        let y =
            event.clientY -
            containerRect.top -
            offsetY;

        x = Math.max(0, Math.min(
            containerRect.width - object.offsetWidth,
            x
        ));

        y = Math.max(0, Math.min(
            containerRect.height - object.offsetHeight,
            y
        ));

        object.style.left = `${x}px`;
        object.style.top = `${y}px`;
    });

    object.addEventListener("pointerup", () => {

        dragging = false;

    });

}

/* ROTATE */

rotateBtn.addEventListener("click", () => {

    if (!selectedFurniture) {
        alert("Select a furniture item first.");
        return;
    }

    let rotation =
        Number(selectedFurniture.dataset.rotation);

    rotation += 15;

    selectedFurniture.dataset.rotation = rotation;

    applyTransform();
});

/* INCREASE SIZE */

increaseBtn.addEventListener("click", () => {

    if (!selectedFurniture) {
        alert("Select a furniture item first.");
        return;
    }

    let scale =
        Number(selectedFurniture.dataset.scale);

    scale += 0.1;

    scale = Math.min(scale, 2);

    selectedFurniture.dataset.scale = scale;

    applyTransform();
});

/* DECREASE SIZE */

decreaseBtn.addEventListener("click", () => {

    if (!selectedFurniture) {
        alert("Select a furniture item first.");
        return;
    }

    let scale =
        Number(selectedFurniture.dataset.scale);

    scale -= 0.1;

    scale = Math.max(scale, 0.5);

    selectedFurniture.dataset.scale = scale;

    applyTransform();
});

function applyTransform() {

    if (!selectedFurniture) return;

    const scale =
        selectedFurniture.dataset.scale;

    const rotation =
        selectedFurniture.dataset.rotation;

    selectedFurniture.style.transform =
        `scale(${scale}) rotate(${rotation}deg)`;
}

/* DELETE */

deleteBtn.addEventListener("click", () => {

    if (!selectedFurniture) {
        alert("Select a furniture item first.");
        return;
    }

    selectedFurniture.remove();

    selectedFurniture = null;

    furnitureCount--;

    updateRecommendations();
});

/* AI RECOMMENDATION ENGINE */

roomType.addEventListener("change", updateRecommendations);
styleType.addEventListener("change", updateRecommendations);
budget.addEventListener("change", updateRecommendations);

function updateRecommendations() {

    const room = roomType.value;
    const style = styleType.value;
    const price = budget.value;

    let suggestions = [];
    let colours = [];

    if (room === "living") {

        suggestions.push("Sofa");
        suggestions.push("Coffee Table");
        suggestions.push("Indoor Plant");

    } else if (room === "bedroom") {

        suggestions.push("Bed");
        suggestions.push("Bedside Lamp");
        suggestions.push("Storage Unit");

    } else {

        suggestions.push("Office Chair");
        suggestions.push("Work Table");
        suggestions.push("Desk Lamp");
    }

    if (style === "modern") {

        colours = [
            "White",
            "Grey",
            "Blue"
        ];

    } else if (style === "minimal") {

        colours = [
            "White",
            "Beige",
            "Light Grey"
        ];

    } else {

        colours = [
            "Brown",
            "Cream",
            "Dark Green"
        ];
    }

    let budgetText = "";

    if (price === "low") {
        budgetText =
            "Choose affordable and space-efficient furniture.";
    } else if (price === "medium") {
        budgetText =
            "Use a balanced combination of quality and cost.";
    } else {
        budgetText =
            "Premium furniture and high-quality finishes are recommended.";
    }

    const recommendationBox =
        document.getElementById("recommendationBox");

    recommendationBox.innerHTML = `
        <div class="recommendation-icon">✨</div>

        <div>
            <h3>Personalized Design Suggestions</h3>

            <p>
                <strong>Room:</strong>
                ${formatText(room)}
            </p>

            <p>
                <strong>Style:</strong>
                ${formatText(style)}
            </p>

            <p>
                <strong>Recommended Furniture:</strong>
                ${suggestions.join(", ")}
            </p>

            <p>
                <strong>Suggested Colours:</strong>
                ${colours.join(", ")}
            </p>

            <p>
                <strong>Budget Guidance:</strong>
                ${budgetText}
            </p>

            <p>
                <strong>Furniture Placed:</strong>
                ${furnitureCount}
            </p>
        </div>
    `;
}

function formatText(value) {

    return value.charAt(0).toUpperCase() +
        value.slice(1);
}

/* SAVE DESIGN */

saveBtn.addEventListener("click", () => {

    const objects =
        [...document.querySelectorAll(".furniture-object")];

    const design = objects.map(object => ({

        item: object.dataset.item,

        left: object.style.left,

        top: object.style.top,

        scale: object.dataset.scale,

        rotation: object.dataset.rotation
    }));

    localStorage.setItem(
        "arInteriorDesign",
        JSON.stringify(design)
    );

    localStorage.setItem(
        "arInteriorSettings",
        JSON.stringify({
            room: roomType.value,
            style: styleType.value,
            budget: budget.value
        })
    );

    alert("Design saved successfully!");
});

/* LOAD SAVED DESIGN */

function loadSavedDesign() {

    const saved =
        localStorage.getItem("arInteriorDesign");

    const settings =
        localStorage.getItem("arInteriorSettings");

    if (settings) {

        const data = JSON.parse(settings);

        roomType.value = data.room;
        styleType.value = data.style;
        budget.value = data.budget;
    }

    if (!saved) {
        updateRecommendations();
        return;
    }

    const objects = JSON.parse(saved);

    objects.forEach(data => {

        const info = furnitureData[data.item];

        if (!info) return;

        const object = document.createElement("div");

        object.className = "furniture-object";

        object.textContent = info.icon;

        object.dataset.item = data.item;

        object.style.left = data.left;
        object.style.top = data.top;

        object.dataset.scale = data.scale;
        object.dataset.rotation = data.rotation;

        furnitureLayer.appendChild(object);

        makeDraggable(object);
    });

    furnitureCount = objects.length;

    updateRecommendations();
}

loadSavedDesign();
