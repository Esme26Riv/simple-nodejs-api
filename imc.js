import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función que calcula el IMC y usa un callback para procesar el resultado
function calcularIMC(peso, altura, callback) {
    const imc = peso / (altura * altura);
    callback(imc, peso, altura);
}

// Callback que interpreta el resultado del IMC
function interpretarIMC(imc, peso, altura) {
    console.log(`\nPeso: ${peso} kg | Estatura: ${altura} m`);
    console.log(`Tu IMC es: ${imc.toFixed(2)}`);

    if (imc < 18.5) {
        console.log("Categoría: Bajo peso");
    } else if (imc < 25) {
        console.log("Categoría: Peso normal");
    } else if (imc < 30) {
        console.log("Categoría: Sobrepeso");
    } else {
        console.log("Categoría: Obesidad");
    }

    mostrarOrigen();
    rl.close();
}

// Función que muestra el origen del cálculo del IMC
function mostrarOrigen() {
    console.log("\n--- Origen del cálculo ---");
    console.log("La fórmula del IMC (peso / altura²) fue desarrollada");
    console.log("por el matemático y estadístico belga Adolphe Quetelet");
    console.log("entre 1830 y 1850, como parte de sus estudios sobre");
    console.log("la 'física social'. Originalmente se llamó 'Índice de Quetelet'");
    console.log("y hoy es utilizado mundialmente como referencia estándar");
    console.log("de salud, aunque tiene limitaciones (no distingue masa");
    console.log("muscular de masa grasa).");
}

// Preguntamos el peso
rl.question('Ingresa tu peso (kg): ', (respuestaPeso) => {
    const peso = parseFloat(respuestaPeso);

    // Preguntamos la altura
    rl.question('Ingresa tu estatura (m): ', (respuestaAltura) => {
        const altura = parseFloat(respuestaAltura);

        calcularIMC(peso, altura, interpretarIMC);
    });
});