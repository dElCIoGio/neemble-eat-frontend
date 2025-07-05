import {Link, NavLink} from "react-router";
import {Button} from "@/components/ui/button";

export function Footer() {

    const year = new Date().getFullYear();

    return (
        <footer className="border-t py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <span className="font-bold text-xl">Neemble Eat</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            © {year} Neemble Eat.
                            <br/>
                            Todos os direitos reservados.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Produto</h3>
                        <ul className="flex flex-col items-start">
                            <Button variant="link" className="p-0 text-sm text-gray-500"><Link to="solutions/digital-menu">Menu Digital</Link></Button>
                            <Button variant="link" className="p-0 text-sm text-gray-500"><Link to="solutions/orders-management">Gestão de Pedidos</Link></Button>
                            <Button variant="link" className="p-0 text-sm text-gray-500"><Link to="solutions/analytics">Analytics</Link></Button>
                            <Button variant="link" className="p-0 text-sm text-gray-500"><Link to="price">Preços</Link></Button>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Empresa</h3>
                        <ul className="flex flex-col items-start  ">
                            <Button variant="link" className="p-0 text-sm text-gray-500"><NavLink to="about-us">Sobre nós</NavLink></Button>
                            <Button variant="link" className="p-0 text-sm text-gray-500"><NavLink to="contact">Contato</NavLink></Button>
                            <Button variant="link" className="p-0 text-sm text-gray-500"><NavLink to="blog">Blog</NavLink></Button>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Contato</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li>geral@neemble-eat.com</li>
                            <li>+244 927 318 912</li>
                            <li>Luanda, Angola</li>
                        </ul>
                        <div className="mt-6 space-x-4">
                            <Link to="https://www.facebook.com/profile.php?id=61572481735004" target="_blank" rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-gray-500">
                                Facebook
                            </Link>
                            <Link to="https://www.instagram.com/neembleeat/" target="_blank" rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-gray-500">
                                Instagram
                            </Link>
                            <Link to="https://www.linkedin.com/company/neemble-ao/" className="text-gray-400 hover:text-gray-500">
                                LinkedIn
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

    );
}

