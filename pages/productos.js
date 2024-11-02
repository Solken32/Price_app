import { useEffect, useState } from 'react';

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '' });
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [productoAActualizar, setProductoAActualizar] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProductos(data);
        };

        fetchProductos();
    }, []);

    const handleAddProduct = () => {
        setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setNuevoProducto({ nombre: '', precio: '' }); // Resetear el formulario
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoProducto({ ...nuevoProducto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProducto),
        });

        if (response.ok) {
            const newProduct = await response.json();
            setProductos([...productos, newProduct]);
            handleCloseAddModal(); // Cerrar modal tras agregar el producto
        } else {
            setError('Error al agregar el producto.'); // Manejo de errores
        }
    };

    const handleUpdateProduct = (producto) => {
        setProductoAActualizar(producto);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setProductoAActualizar(null);
    };

    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setProductoAActualizar({ ...productoAActualizar, [name]: value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/products', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoAActualizar),
        });

        if (response.ok) {
            const updatedProduct = await response.json();
            setProductos(productos.map(producto => 
                producto.id === updatedProduct.id ? updatedProduct : producto
            ));
            handleCloseUpdateModal(); // Cerrar modal tras actualizar el producto
        } else {
            setError('Error al actualizar el producto.'); // Manejo de errores
        }
    };

    const handleDeleteProduct = (producto) => {
        setProductoAEliminar(producto);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        const response = await fetch(`/api/products?id=${productoAEliminar.id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setProductos(productos.filter(p => p.id !== productoAEliminar.id));
            setShowDeleteModal(false);
            setProductoAEliminar(null);
        } else {
            setError('Error al eliminar el producto.'); // Manejo de errores
        }
    };

    const filteredProducts = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md w-full max-w-3xl">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4 text-center">Lista de Productos</h1>
                    <div className="flex mb-4">
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 border border-gray-300 p-2 rounded-lg"
                        />
                        <button
                            onClick={handleAddProduct}
                            className="bg-blue-600 text-white rounded-lg p-2 ml-2 hover:bg-blue-700 transition duration-300"
                        >
                            Agregar Producto
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700 text-left">
                                    <th className="py-3 px-4 border-b">ID</th>
                                    <th className="py-3 px-4 border-b">Nombre</th>
                                    <th className="py-3 px-4 border-b">Precio</th>
                                    <th className="py-3 px-4 border-b">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((producto) => (
                                        <tr key={producto.id} className="hover:bg-gray-100">
                                            <td className="py-2 px-4 border-b">{producto.id}</td>
                                            <td className="py-2 px-4 border-b">{producto.nombre}</td>
                                            <td className="py-2 px-4 border-b">S/ {producto.precio}</td>
                                            <td className="py-2 px-4 border-b">
                                                <button 
                                                    onClick={() => handleUpdateProduct(producto)}
                                                    className="bg-blue-600 text-white rounded-lg px-2 py-1 hover:bg-blue-700 transition duration-300 mr-2"
                                                >
                                                    Actualizar
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(producto)}
                                                    className="bg-red-600 text-white rounded-lg px-2 py-1 hover:bg-red-700 transition duration-300"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center text-gray-500">No hay productos disponibles.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para agregar producto */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-80">
                        <h2 className="text-lg font-bold mb-4">Agregar Producto</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1" htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={nuevoProducto.nombre}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1" htmlFor="precio">Precio</label>
                                <input
                                    type="number"
                                    name="precio"
                                    value={nuevoProducto.precio}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-green-600 text-white rounded-lg p-2 hover:bg-green-700 transition duration-300">
                                Agregar
                            </button>
                            <button onClick={handleCloseAddModal} className="bg-gray-500 text-white rounded-lg p-2 hover:bg-gray-600 transition duration-300 ml-2">
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para actualizar producto */}
            {showUpdateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-80">
                        <h2 className="text-lg font-bold mb-4">Actualizar Producto</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1" htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={productoAActualizar.nombre}
                                    onChange={handleUpdateInputChange}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1" htmlFor="precio">Precio</label>
                                <input
                                    type="number"
                                    name="precio"
                                    value={productoAActualizar.precio}
                                    onChange={handleUpdateInputChange}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition duration-300">
                                Actualizar
                            </button>
                            <button onClick={handleCloseUpdateModal} className="bg-gray-500 text-white rounded-lg p-2 hover:bg-gray-600 transition duration-300 ml-2">
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para eliminar producto */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-80">
                        <h2 className="text-lg font-bold mb-4">Eliminar Producto</h2>
                        <p>¿Estás seguro de que deseas eliminar el producto <strong>{productoAEliminar?.nombre}</strong>?</p>
                        <div className="mt-4">
                            <button onClick={handleConfirmDelete} className="bg-red-600 text-white rounded-lg p-2 hover:bg-red-700 transition duration-300">
                                Eliminar
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white rounded-lg p-2 hover:bg-gray-600 transition duration-300 ml-2">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
