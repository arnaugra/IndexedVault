import { useState } from "react";
import HamburgerOpen from "../svg/HamburgerIcon";
import HamburgerClose from "../svg/CloseIcon";
import SideTree from "./SideTree";
import { Link } from "wouter";
import ThemeChanger from "./ThemeChanger";
import EncryptModal from "./EncryptModal";
import ToastComponent from "../components/ToastComponent";
import useEncryptStore from "../stores/EncryptStore";
import LockCloseIcon from "../svg/LockCloseIcon";
import LockOpenIcon from "../svg/LockOpenIcon";

function AppLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const setOpenModalEncrypt = useEncryptStore((state) => state.setOpenModal);
    const encryptionKey = useEncryptStore((state) => state.encryptionKey);
    const loadEncryptionKey = useEncryptStore((state) => state.loadEncryptionKey);

    loadEncryptionKey();

    return (
        <div className="grid h-dvh
            grid-cols-1 grid-rows-[4rem_1fr]
            md:grid-cols-[20rem_1fr] md:grid-rows-[4rem_1fr]
            xl:grid-cols-[20rem_1fr] xl:grid-rows-[4rem_1fr]
        ">

            <EncryptModal />

            <ToastComponent />

            {/* Header */}
            <header className="flex items-center gap-4 p-4
                md:col-start-1 md:row-start-1 md:row-end-2 md:col-end-2
                xl:col-span-2 xl:row-start-1 xl:row-end-2 xl:col-start-1 xl:col-end-2
            ">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="xl:hidden">
                    {sidebarOpen ? <HamburgerClose stroke strokeWidth="2" /> : <HamburgerOpen stroke strokeWidth="2" />}
                </button>
                <Link href="/">
                    <h1>Indexed Vault</h1>
                </Link>
            </header>

            {/* Sidebar */}
            <aside className={`
                p-4
                ${sidebarOpen ? "flex flex-col justify-between" : "hidden"}
                flex flex-col justify-between
                row-start-2 row-end-3 col-start-1 col-end-2
                xl:flex xl:row-start-2 xl:row-end-auto xl:col-start-1
            `}>
                <SideTree />

                <div className="flex justify-evenly gap-4 p-4">
                    
                    <div className="tooltip flex items-center w-min" data-tip="Add Encryption Key">
                        <button className="btn btn-circle btn-ghost" onClick={() => setOpenModalEncrypt(true)}>
                            {encryptionKey ? <LockCloseIcon className="w-5 text-success" /> : <LockOpenIcon className="w-5 text-error" />}
                        </button>
                    </div>
                    
                    <div className="tooltip flex items-center w-min" data-tip="Change Theme">
                        <ThemeChanger />
                    </div>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className={`p-4 overflow-y-auto
                ${sidebarOpen 
                    ? "md:col-start-2 md:row-start-1 hidden md:block border-l border-gray-600" 
                    : "md:col-start-1 md:row-start-2 block"
                }
                md:col-end-3 md:row-end-3
                xl:col-start-2 xl:row-start-1
                @container/layout
            `}>
                {children}
            </main>
        </div>
    );
}

export default AppLayout;
