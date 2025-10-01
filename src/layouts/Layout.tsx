import { useEffect, useState } from "react";
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
import { uploadProject } from "../utils/downloadProject";
import useToastStore, { ToastsTypes } from "../stores/ErrorStore";
import useProjectsStore from "../stores/ProjectsStore";
import UploadIcon from "../svg/UploadIcon";
// import GitHubIssueIcon from "../svg/GitHubIssueIcon";

function AppLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { addToast } = useToastStore.getState()
    const { setProjects } = useProjectsStore();
    const { setOpenModal, encryptionKey, loadEncryptionKey } = useEncryptStore();

    useEffect(() => {
        loadEncryptionKey();
    }, [loadEncryptionKey]);

    const handleUploadProject: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            addToast({
                id: Math.random(),
                message: "No file selected",
                type: ToastsTypes.error,
                timestamp: Date.now()
            })
            return;
        }
        await uploadProject(file);
        
        setTimeout(() => {
            // hacky, but it works
            setProjects()
        }, 100);
    };

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
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="xl:hidden cursor-pointer">
                    {sidebarOpen ? <HamburgerClose stroke strokeWidth="2" /> : <HamburgerOpen stroke strokeWidth="2" />}
                </button>
                <Link href="/" className="flex items-center gap-0.5">
                    <h1>IndexedVault</h1> {import.meta.env.DEV && <sup className="text-warning font-semibold">dev</sup>}
                </Link>

            </header>

            {/* Sidebar */}
            <aside className={`
                p-4
                ${sidebarOpen ? "flex flex-col justify-between" : "hidden"}
                h-[calc(100vh-4rem)]
                flex flex-col justify-between gap-4
                row-start-2 row-end-3 col-start-1 col-end-2
                xl:flex xl:row-start-2 xl:row-end-auto xl:col-start-1
            `}>
                <SideTree />

                <div className="flex justify-evenly gap-4 px-4">
                    
                    <div className="tooltip flex items-center w-min" data-tip="Add Encryption Key">
                        <button className="btn btn-circle btn-ghost" onClick={() => setOpenModal(true)}>
                            {encryptionKey ? <LockCloseIcon className="w-5 text-success" /> : <LockOpenIcon className="w-5 text-error" />}
                        </button>
                    </div>

                    {/* Actually, this is not used right now, but it could be useful in the future */}
                    {/* <div className="tooltip flex items-center w-min" data-tip="Create a GitHub Issue">
                        <button className="btn btn-circle btn-ghost" onClick={() => open("https://github.com/arnaugra/IndexedVault/issues/new", "_blank", "noopener noreferrer")}>
                            <GitHubIssueIcon className="w-5" />
                        </button>
                    </div> */}

                    <div className="tooltip flex items-center w-min" data-tip="Import Project">
                        {/* upload file */}
                        <label htmlFor="upload-project" className="btn btn-circle btn-ghost cursor-pointer">

                            <UploadIcon className="w-6" />
                            <input type="file" id="upload-project" className="hidden" accept=".json,application/json" onChange={handleUploadProject} />
                        </label>
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
                xl:col-start-2 xl:row-start-1 xl:border-l xl:border-gray-600
                @container/layout
            `}>
                {children}
            </main>
        </div>
    );
}

export default AppLayout;
