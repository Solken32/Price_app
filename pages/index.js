// pages/index.js
import Head from 'next/head';
import Link from 'next/link';


export default function Home() {
  return (
    <>
      <Head>
        <title>Bienvenido a Product Price App</title>
        <meta name="description" content="Consulta precios de productos fácilmente." />
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-poppins">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            <i className="fa fa-shopping-cart text-blue-400"></i>
            <span className="block mt-2">Product Price App</span>
          </h1>
          <p className="text-lg m-6">
            La solución perfecta para consultar y gestionar precios de productos de forma rápida y sencilla.
          </p>
          <Link href="/productos">
            <button
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              <i className="fa fa-arrow-right mr-2"></i>
              Comenzar
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

