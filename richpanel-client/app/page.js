import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
    return (
        <>
            <Header />
            <div className="bg-primary p-4 flex justify-center items-center cursor-pointer text-white h-screen">
                <h2>Richapanel</h2>
                </div>
            <Footer />
        </>
    );
}