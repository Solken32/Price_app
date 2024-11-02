// pages/api/login.js
import db from '../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // Aquí puedes agregar lógica de sesión o token
        return res.status(200).json({ message: 'Inicio de sesión exitoso', user });
      } else {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error en la base de datos', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
