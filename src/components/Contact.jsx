
import Swal from "sweetalert2";
import { useState } from "react";
const Contact = () => {
  const [message, setMessage] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "dd64c439-81c3-432c-b88a-9091eaf3aff6");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      setMessage("Message sent successfully");
      Swal.fire({
        title: "Successfully!",
        text: "Your message has been submitted!",
        icon: "success",
      });
      event.target.reset();
    } else {
      setMessage("Something went wrong");
    }
    
  };
  return (
        <section
      id="contact"
      className="min-h-screen flex items-center justify-center  px-10 py-20"
    >
      <div className="w-full max-w-5xl shadow-lg rounded-2xl p-8">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-red-800 mb-10">
          Contact <span className="text-red-900">Me</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-20">
          {/* Left side */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-red-800">
              Get in Touch
            </h3>
            <p className="text-lg text-black mb-8">
              Feel free to reach out to me by filling this form or contact our team
              directly via email.
            </p>

            <ul className="space-y-6 text-lg text-black">
              <li>
                <strong>Email:</strong> carent@gmail.com
              </li>
              <li>
                <strong>Phone:</strong> +855 12 345 6789
              </li>
              <li>
                <strong>Location:</strong> Phnom Penh, Cambodia
              </li>
            </ul>
          </div>

          {/* Right side (form) */}
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label className="block text-lg text-red-800 mb-2">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none text-black  text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-red-800 mb-1">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none text-balance"
                required
              />
            </div>

            <div>
              <label className="block text-red-800 mb-1">Message</label>
              <textarea
                name="message"
                rows="4"
                placeholder="Your message"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none text-black "
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition cursor-pointer font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
