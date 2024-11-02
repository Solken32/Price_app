import db from '../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const [rows] = await db.query('SELECT * FROM productos');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener productos', error });
        }
    } else if (req.method === 'POST') {
        const { nombre, precio } = req.body;
        try {
            const [result] = await db.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
            res.status(201).json({ id: result.insertId, nombre, precio });
        } catch (error) {
            res.status(500).json({ message: 'Error al agregar el producto', error });
        }
    } else if (req.method === 'PUT') {
        const { id, nombre, precio } = req.body;
        try {
            await db.query('UPDATE productos SET nombre = ?, precio = ? WHERE id = ?', [nombre, precio, id]);
            res.status(200).json({ id, nombre, precio });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el producto', error });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        try {
            await db.query('DELETE FROM productos WHERE id = ?', [id]);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el producto', error });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
