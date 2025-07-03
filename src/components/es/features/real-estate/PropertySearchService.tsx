import { useState } from "react";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";
import type { ChangeEvent } from "react";

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  birthday: string;
}

interface PropertyDetails {
  purpose: string[];
  type: string;
  size: string;
  location: string;
  preferences: string[];
}

interface Amenities {
  features: string[];
  comments: string;
}

interface FormData {
  userDetails: UserDetails;
  propertyDetails: PropertyDetails;
  amenities: Amenities;
}

const initialFormData: FormData = {
  userDetails: {
    name: "",
    email: "",
    phone: "",
    nationality: "",
    birthday: "",
  },
  propertyDetails: {
    purpose: [],
    type: "",
    size: "",
    location: "",
    preferences: [],
  },
  amenities: {
    features: [],
    comments: "",
  },
};

const PropertyServiceComponent = () => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);

    const handleNext = () => setStep((prev: number) => Math.min(prev + 1, 4));
    const handleBack = () => setStep((prev: number) => Math.max(prev - 1, 1));
    const handleToggleForm = () => setShowForm((prev: boolean) => !prev);

    // Update form data
    const updateFormData = <K extends keyof FormData, F extends keyof FormData[K]>(
        section: K,
        key: F,
        value: FormData[K][F]
    ) => {
        setFormData((prev) => ({
        ...prev,
        [section]: {
            ...prev[section],
            [key]: value,
        },
        }));
    };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-full lg:w-2/3 ">
          <h2 className="md:text-3xl font-bold text-primary mb-4">
            Servicio de búsqueda de propiedades en Colombia
          </h2>
          <p className="text-gray-600 md:text-lg">
            Descubre tu propiedad ideal en Colombia con la guía de un
            consultor inmobiliario experto. Nuestro servicio se especializa en encontrar
            la oportunidad de inversión perfecta, adaptada a tus necesidades.
            <br />
            Aprovecha tours de inversión exclusivos para explorar
            propiedades de alto potencial, guiados por profesionales con amplia
            experiencia. Desde identificar oportunidades hasta cerrar tratos, nosotros
            aseguramos un proceso fluido e informado.
          </p>

          {/* Social Media Links */}
          <div className="flex justify-center lg:justify-start gap-4 mt-4">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 text-2xl"
            >
              <FaYoutube />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 text-2xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black text-2xl"
            >
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      {/* Toggle Bar */}
      <div
        onClick={handleToggleForm}
        className="hidden mt-8 p-4 bg-secondary text-white text-center font-semibold cursor-pointer rounded-lg shadow-md hover:bg-secondary/90"
      >
        ¿Qué propiedad estás buscando? Déjanos contactarte
      </div>

      {/* Multi-Step Form */}
      {showForm && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
          {/* Step Navigation */}
          <div className="flex justify-between mb-6">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 bg-gray-200 rounded-lg text-gray-600 disabled:opacity-50"
            >
              Atrás
            </button>
            <span className="text-lg font-semibold">
              Paso {step} de 4
            </span>
            <button
              onClick={handleNext}
              disabled={step === 4}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Datos del Usuario</h3>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="p-3 border rounded-lg"
                  value={formData.userDetails.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateFormData("userDetails", "name", e.target.value)
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="p-3 border rounded-lg"
                  value={formData.userDetails.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateFormData("userDetails", "email", e.target.value)
                  }
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  className="p-3 border rounded-lg"
                  value={formData.userDetails.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateFormData("userDetails", "phone", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Nacionalidad"
                  className="p-3 border rounded-lg"
                  value={formData.userDetails.nationality}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateFormData("userDetails", "nationality", e.target.value)
                  }
                />
                <input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  className="p-3 border rounded-lg"
                  value={formData.userDetails.birthday}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateFormData("userDetails", "birthday", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Detalles de la Propiedad</h3>
              <div className="flex flex-col gap-4">
                <select
                  multiple
                  className="p-3 border rounded-lg"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    updateFormData(
                      "propertyDetails",
                      "purpose",
                      Array.from(e.target.selectedOptions, (option) =>
                        option.value
                      )
                    )
                  }                  
                >
                  <option>Inversión</option>
                  <option>Vivir tiempo completo</option>
                  <option>Vivir tiempo parcial</option>
                  <option>Alquiler</option>
                </select>
                <select className="p-3 border rounded-lg" 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        updateFormData("propertyDetails", "type", e.target.value)
                    }
                    >
                  <option>Finca</option>
                  <option>Apartamento</option>
                  <option>Casa</option>
                  <option>Dúplex</option>
                  <option>Penthouse</option>
                </select>
                <input
                  type="text"
                  placeholder="Tamaño (m² o ft²)"
                  className="p-3 border rounded-lg"
                  value={formData.propertyDetails.size}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateFormData("propertyDetails", "size", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Ubicación (ej: Medellín, Envigado)"
                  className="p-3 border rounded-lg"
                  value={formData.propertyDetails.location}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateFormData(
                      "propertyDetails",
                      "location",
                      e.target.value
                    )
                  }
                />
                <select 
                    multiple 
                    className="p-3 border rounded-lg"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        updateFormData(
                          "propertyDetails",
                          "preferences",
                          Array.from(e.target.selectedOptions, (option) =>
                            option.value
                          )
                        )
                      }
                >
                  <option>Área rural</option>
                  <option>Residencial</option>
                  <option>Cerca de la playa</option>
                  <option>Con vista a la montaña</option>
                  <option>Cerca del centro</option>
                  <option>Cerca de zona de fiesta</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Amenidades</h3>
              <div className="flex flex-col gap-4">
                <select 
                    multiple 
                    className="p-3 border rounded-lg"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        updateFormData(
                          "amenities",
                          "features",
                          Array.from(e.target.selectedOptions, (option) =>
                            option.value
                          )
                        )
                      }
                    >
                  <option>Seguridad privada</option>
                  <option>Piscina</option>
                  <option>Gimnasio</option>
                  <option>Número de habitaciones</option>
                  <option>Número de baños</option>
                </select>
                <textarea
                  placeholder="Comentarios adicionales"
                  className="p-3 border rounded-lg"
                  value={formData.amenities.comments}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    updateFormData("amenities", "comments", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Resumen</h3>
              <pre className="p-3 bg-gray-100 rounded-lg text-sm">
                {JSON.stringify(formData, null, 2)}
              </pre>

              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>Acepto términos, condiciones y política de privacidad</span>
              </label>
              <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg">
                Enviar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyServiceComponent; 