import About2 from "@/components/Home/About";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import HighLight from "@/components/Home/highlight";
import Navbar from "@/components/Home/Nav";
import Pricing from "@/components/Home/Pricing";
import Show from "@/components/Home/Show";

export default function Home(){
    return(
        <>
            <Navbar/>
            <Header/>
            <HighLight/>
            <Show/>
            <About2/>
            <Pricing/>
            <Footer/>
        </>
    )
}