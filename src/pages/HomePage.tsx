import React from 'react';
import { Link } from 'react-router-dom';
import circuitoImg from '../assets/circuitoElectronico.jpg'; 

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-center p-4">
      {/* Sección Hero - Banner principal */}
<section className="relative w-full max-w-4xl mb-12 rounded-xl shadow-xl overflow-hidden">
      {/* Fondo con imagen desenfocada */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 "
        style={{ backgroundImage: `url(${circuitoImg})` }}
        aria-hidden="true"
      ></div>

      {/* Contenido principal */}
      <div className=" text-stone-950 py-20 px-6 relative">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Tu Destino para la Innovación Electrónica
        </h1>
        <p className="text-xl md:text-2xl mb-8 ">
          Encuentra los <strong className='text-blue-900'>componentes</strong> a buen precio, <strong className='text-blue-900'>perfectos para tus proyectos</strong> de robótica, IoT y electrónica.
        </p>
        <Link
          to="/products"
          className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Explora Productos
        </Link>
      </div>
    </section>


      {/* Sección de Destacados */}
      <section className="w-full max-w-5xl mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Categorías Populares</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Tarjeta de Ctg 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://via.placeholder.com/100?text=Micro" alt="Microcontroladores" className="mb-4 rounded-full" />{/* buscar img en src pendiente */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Microcontroladores</h3>
            <p className="text-gray-600 text-center text-sm mb-4">Aqui va el cerebro de tus proyectos.</p>
            <Link to="/products?category=Microcontroladores" className="text-blue-600 hover:underline font-medium">
              Ver más
            </Link>
          </div>

          {/* Tarjeta de Ctg 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://via.placeholder.com/100?text=Sensor" alt="Sensores" className="mb-4 rounded-full" />{/* buscar img en src pendiente */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Sensores</h3>
            <p className="text-gray-600 text-center text-sm mb-4">Asi percibimos el mundo real. bip!!..</p>
            <Link to="/products?category=Sensores" className="text-blue-600 hover:underline font-medium">
              Ver más
            </Link>
          </div>

          {/* Tarjeta de Ctg 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://via.placeholder.com/100?text=Actuador" alt="Actuadores" className="mb-4 rounded-full" />{/* buscar img en src pendiente */}
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Actuadores</h3>
            <p className="text-gray-600 text-center text-sm mb-4">Movimiendo a tus ideas.</p>
            <Link to="/products?category=Actuadores" className="text-blue-600 hover:underline font-medium">
              Ver más
            </Link>
          </div>
        </div>
      </section>

      {/* Sección para Testimonios (ejemplo) */}
      <section className="bg-white py-12 px-6 w-full max-w-4xl rounded-lg shadow-lg mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Testimonios</h2>
        <div className="space-y-6">
          <blockquote className="text-gray-600 italic">
            "Makers Store ha sido mi aliado perfecto para mis proyectos de robótica. ¡Excelente calidad y servicio!"
          </blockquote>
          <blockquote className="text-gray-600 italic">
            "Siempre encuentro lo que necesito a un buen precio. ¡Recomendado!"
          </blockquote>
        </div>
        </section>
        {/* buscar img o un id de cliente pendiente */}

      <section className="bg-gray-100 py-16 px-6 w-full max-w-4xl rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ¿Por Qué Elegir Makers Store?
        </h2>
        <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
          Ofrecemos una selección de componentes de <strong>alta calidad</strong>, envío rápido y un soporte excepcional para ayudarte en cada etapa de tus proyectos.
        </p>
      </section>
    </div>
  );
};

export default HomePage;