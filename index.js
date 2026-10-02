import express from 'express';
import fs from "fs"; 

const app = express();

app.use(express.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data, null, 4));
    } catch (error) {
        console.log(error);
    }
};

app.get("/", (req, res) => {
    res.send("Bienvenido a mi API de la biblioteca con Node JS !!");
});

app.get("/libros", (req, res) => {
    const data = readData();
    res.json(data.libros);
});

app.get("/libros/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const libro = data.libros.find((l) => l.id === id);

    if (!libro) {
        return res.status(404).json({ error: "Libro no encontrado" });
    }

    res.json(libro);
});

app.post("/libros", (req, res) => {
    const data = readData();
    const body = req.body;

    const nuevoId = data.libros.length > 0
        ? Math.max(...data.libros.map((l) => l.id)) + 1
        : 1;

    const newLibro = {
        id: nuevoId,
        ...body,
    };
    data.libros.push(newLibro);
    writeData(data);
    res.status(201).json(newLibro);
});

app.put("/libros/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const body = req.body;

    const index = data.libros.findIndex((l) => l.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Libro no encontrado" });
    }

    data.libros[index] = {
        ...data.libros[index],
        ...body,
        id, 
    };

    writeData(data);
    res.json({ message: "Libro modificado con éxito" });
});

app.delete("/libros/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.libros.findIndex((l) => l.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Libro no encontrado" });
    }

    data.libros.splice(index, 1);

    writeData(data);
    res.json({ message: "Libro borrado con éxito" });
});

app.listen(3000, () => {
    console.log('Servidor escuchando por el puerto 3000');
});
