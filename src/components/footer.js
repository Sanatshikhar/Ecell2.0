
import { Link } from "react-router-dom";
import logo from "./favicon.png";
// import github from "./github.svg" ;

function footer() {
    return (




    <footer class="bg-transparent shadow-sm dark:bg-gray-900">
            <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div class="sm:flex sm:items-center sm:justify-between">
                    <a href="https://flowbite.com/" class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src={logo} class="h-8" alt="Flowbite Logo" />
                        <span class="self-center text-xl font-semibold whitespace-nowrp text-white">E-Cell SOA</span>
                    </a>
                    <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <Link to="/about" className="hover:underline me-4 md:me-6">
                                About
                            </Link>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/company/ecellsoau/" class="hover:underline me-4 md:me-6">Linkedin</a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/ecellsoau/" class="hover:underline me-4 md:me-6">Instagram</a>
                        </li>
                        <li>
                             <Link to="/contact" class="hover:underline">Contact</Link>
                        </li>
                    </ul>
                </div>
                <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">&copy; 2025 E-Cell, Institute of Technical Education and Research (ITER). All rights reserved.</span>
            </div>
        </footer>



    );
}

export default footer;


