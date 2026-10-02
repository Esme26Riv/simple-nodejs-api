import express from 'express';
import fs from "fs"; // Permite trabajar con file system
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// ¡Muy importante! Middleware para que Express entienda los JSON en el req.body
app.use(express.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (err) {
        console.log(err); // Corregido: se usa 'err' en lugar de 'error'
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

app.get("/", (req, res) => {
    res.send("Bienvenido a mi primer API con Node JS !!");
});

// Obtener todos los pacientes
app.get("/pacientes", (req, res) => {
    const data = readData();
    res.json(data.pacientes);
});

// Obtener un paciente por ID (Ruta separada correctamente)[cite: 2]
app.get("/pacientes/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id); // Corregido: 'parseInt'
    const paciente = data.pacientes.find((p) => p.id === id); // Corregido: 'data.pacientes'
    res.json(paciente);
});

// Crear un nuevo paciente
app.post("/pacientes", (req, res) => {
    const data = readData();
    const body = req.body;
    const newPaciente = {
        id: data.pacientes.length + 1,
        ...body,
    };
    data.pacientes.push(newPaciente);
    writeData(data);
    res.json(newPaciente);
});

// Actualizar un paciente por ID
app.put("/pacientes/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const body = req.body;

    // Buscamos el índice del paciente en el arreglo
    const index = data.pacientes.findIndex((p) => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Paciente no encontrado" });
    }

    // Actualizamos manteniendo los datos anteriores y sobreescribiendo los nuevos
    data.pacientes[index] = {
        ...data.pacientes[index],
        ...body,
    };

    writeData(data);
    res.json({ message: "Dato modificado con exito" });
});

app.delete("/pacientes/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.pacientes.findIndex((p) => p.id === id);

    // Validamos si el paciente no existe
    if (index === -1) {
        return res.status(404).json({ error: "Paciente no encontrado" });
    }

    // Si sí existe, lo borramos usando la variable 'index' correcta
    data.pacientes.splice(index, 1);

    writeData(data);
    res.json({ message: "Paciente borrado con éxito" });
});

app.listen(3000, () => {
    console.log('Servidor escuchando por el puerto 3000');
});