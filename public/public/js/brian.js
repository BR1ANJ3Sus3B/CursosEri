console.log("brian.js se ha cargado correctamente");

window.showTopic = function(topicId) {
    // Ocultar todos los temas
    const topics = document.querySelectorAll('.topic');
    topics.forEach(topic => topic.style.display = 'none');

    // Mostrar el tema seleccionado
    const selectedTopic = document.getElementById(topicId);
    if (selectedTopic) {
        selectedTopic.style.display = 'block';
    }

    // Marcar el checkbox como completado si existe
    var topicCheckbox = document.getElementById('checkbox_' + topicId);
    if (topicCheckbox) {
        topicCheckbox.classList.toggle('checked');
    }

    // Verificar si todos los checkboxes están marcados
    checkCompletion();
};

function checkCompletion() {
    const topics = ['intro', 'comenzar', 'base', 'corrector', 'polvo', 'rubor', 'ojos', 'labios', 'fijacion', 'tiposPiel', 'tecnicasAvanzadas', 'tendencias', 'erroresComunes', 'ocasiones'];
    let allCompleted = true;

    topics.forEach(topic => {
        const checkbox = document.getElementById('checkbox_' + topic);
        if (checkbox && !checkbox.classList.contains('checked')) {
            allCompleted = false;
        }
    });

    // Mostrar el botón si todos los checkboxes están marcados
    const certificado = document.getElementById('certificado');
    if (certificado) {
        certificado.style.display = allCompleted ? 'block' : 'none';
    }
}

// Agregar eventos a los checkboxes
document.querySelectorAll('.completed-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', function() {
        this.classList.toggle('checked');
        checkCompletion();
    });
});
