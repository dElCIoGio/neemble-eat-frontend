import { useState } from "react";
import {sendPasswordResetEmail} from "firebase/auth";
import {auth} from "@/firebase/config";



export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage(`Um e-mail para redefinir sua senha foi enviado.`);
        } catch (err) {
            setError("Não foi possível enviar o e-mail. Por favor, tente novamente.");
            console.error(err);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h1 className="text-2xl font-semibold mb-4">Esqueceu sua senha?</h1>
                <p className="text-gray-600 mb-6">
                    Insira seu endereço de e-mail e enviaremos um link para redefinir sua senha.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Endereço de E-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Enviar Link de Redefinição
                    </button>
                </form>
            </div>
        </div>    );
}