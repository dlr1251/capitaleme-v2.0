import { useState } from "react";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

// Type definitions
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

const PropertyServiceComponent = () => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [step, setStep] = useState<number>(1);

    // State to store form data
    const [formData, setFormData] = useState<FormData>({
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
    });

    const handleNext = () => setStep((prev: number) => Math.min(prev + 1, 4));
    const handleBack = () => setStep((prev: number) => Math.max(prev - 1, 1));
    const handleToggleForm = () => setShowForm((prev: boolean) => !prev);

    // Update form data
    const updateFormData = (section: keyof FormData, key: string, value: any) => {
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
            Finding property service in Colombia
          </h2>
          <p className="text-gray-600 md:text-lg">
            Discover your dream property in Colombia with the guidance of an
            expert real estate consultant. Our service specializes in finding
            the perfect investment opportunity, tailored to your needs.
            <br />
            Take advantage of exclusive investment tours to explore
            high-potential properties, guided by professionals with extensive
            experience. From identifying opportunities to closing deals, we
            ensure a smooth, informed process.
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
        What property are you looking for? Let us contact you
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
              Back
            </button>
            <span className="text-lg font-semibold">
              Step {step} of 4
            </span>
            <button
              onClick={handleNext}
              disabled={step === 4}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">User Details</h3>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="p-3 border rounded-lg"
                  value={formData.userDetails.name}
                  onChange={(e) =>
                    updateFormData("userDetails", "name", e.target.value)
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="p-3 border rounded-lg"
                  value={formData.userDetails.email}
                  onChange={(e) =>
                    updateFormData("userDetails", "email", e.target.value)
                  }
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="p-3 border rounded-lg"
                  value={formData.userDetails.phone}
                  onChange={(e) =>
                    updateFormData("userDetails", "phone", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Nationality"
                  className="p-3 border rounded-lg"
                  value={formData.userDetails.nationality}
                  onChange={(e) =>
                    updateFormData("userDetails", "nationality", e.target.value)
                  }
                />
                <input
                  type="date"
                  placeholder="Birthday"
                  className="p-3 border rounded-lg"
                  value={formData.userDetails.birthday}
                  onChange={(e) =>
                    updateFormData("userDetails", "birthday", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="flex flex-col gap-4">
                <select
                  multiple
                  className="p-3 border rounded-lg"
                  onChange={(e) =>
                    updateFormData(
                      "propertyDetails",
                      "purpose",
                      Array.from(e.target.selectedOptions, (option) =>
                        option.value
                      )
                    )
                  }                  
                >
                  <option>Investment</option>
                  <option>Living full-time</option>
                  <option>Living part-time</option>
                  <option>Renting</option>
                </select>
                <select
                  className="p-3 border rounded-lg"
                  onChange={(e) =>
                    updateFormData("propertyDetails", "type", e.target.value)
                  }
                >
                  <option>Finca</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Duplex</option>
                  <option>Penthouse</option>
                </select>
                <input
                  type="text"
                  placeholder="Size (m² or ft²)"
                  className="p-3 border rounded-lg"
                  value={formData.propertyDetails.size}
                  onChange={(e) =>
                    updateFormData("propertyDetails", "size", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Location (e.g., Medellin, Envigado)"
                  className="p-3 border rounded-lg"
                  value={formData.propertyDetails.location}
                  onChange={(e) =>
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
                    onChange={(e) =>
                        updateFormData(
                          "propertyDetails",
                          "preferences",
                          Array.from(e.target.selectedOptions, (option) =>
                            option.value
                          )
                        )
                      }
                >
                  <option>Rural area</option>
                  <option>Residential</option>
                  <option>Near the beach</option>
                  <option>With a hill view</option>
                  <option>Close to downtown</option>
                  <option>Near party area</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="flex flex-col gap-4">
                <select 
                    multiple 
                    className="p-3 border rounded-lg"
                    onChange={(e) =>
                        updateFormData(
                          "amenities",
                          "features",
                          Array.from(e.target.selectedOptions, (option) =>
                            option.value
                          )
                        )
                      }
                    >
                  <option>Private security</option>
                  <option>Pool</option>
                  <option>Gym</option>
                  <option>Number of bedrooms</option>
                  <option>Number of bathrooms</option>
                </select>
                <textarea
                  placeholder="Additional comments"
                  className="p-3 border rounded-lg"
                  value={formData.amenities.comments}
                  onChange={(e) =>
                    updateFormData("amenities", "comments", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Summary</h3>
              <pre className="p-3 bg-gray-100 rounded-lg text-sm">
                {JSON.stringify(formData, null, 2)}
              </pre>

              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>I accept terms, conditions, and privacy policy</span>
              </label>
              <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg">
                Submit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyServiceComponent;