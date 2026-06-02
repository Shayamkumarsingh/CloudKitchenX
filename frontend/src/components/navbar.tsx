import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppData } from "../context/AppContext";
import { CgShoppingCart } from "react-icons/cg";
import { BiMapPin, BiSearch } from "react-icons/bi";

const Navbar = () => {
    const { isAuth , city} = useAppData();
    const currLocation = useLocation();

    const isHomePage = currLocation.pathname === "/";

    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.trim()) {
                setSearchParams({ search });
            } else {
                setSearchParams({});
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [search, setSearchParams]);

    return (
        <div className="w-full bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between py-4 px-3">
                <Link
                    to={"/"}
                    className="text-2xl font-bold text-[#E23774] cursor-pointer"
                >
                    CloudKitchenX
                </Link>

                <div className="flex items-center gap-4">
                    <Link to={"/cart"} className="relative">
                        <CgShoppingCart className="h-6 w-6 text-[#E23774]" />
                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E23774] text-xs font-semibold text-white">
                            0
                        </span>
                    </Link>

                    {isAuth ? (
                        <Link
                            to={"/account"}
                            className="font-medium text-[#E23774]"
                        >
                            Account
                        </Link>
                    ) : (
                        <Link
                            to={"/login"}
                            className="font-medium text-[#E23774]"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {isHomePage && (
                <div className="border-t px-4 py-3">
                    <div className="mx-auto max-w-7xl items-center rounded-lg border shadow-sm flex">
                        
                        <div className="flex items-center gap-3 px-4 border-r text-gray-700">
                            <BiMapPin className="h-5 w-5 text-[#E23774]" />
                            <span className="text-sm truncate max-w-35">
                                {city}
                            </span>
                        </div>

                        <div className="flex flex-1 items-center px-4 gap-2">
                            <BiSearch className="h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search for restaurants and food"
                                className="w-full py-2 text-sm outline-none"
                            />
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;