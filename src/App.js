import { Route, Routes } from "react-router-dom";

import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Register from "./components/Register";

import Header from "./components/header";
import { BlogProvider, UserContextProvider } from "./Context";
import NewArticle from "./components/NewArticle";
import Article from "./components/Article";
import Edit from "./components/Edit";
import Spinner from "./components/Spinner";

function App() {
  return (
    // <UserContextProvider>
    //   <BlogProvider>
    //     <div className="max-w-[1440px] h-full   w-full">
    //       <Header />
    //       <Routes>
    //         <Route path="/" element={<Hero />} />
    //         <Route path="/new" element={<NewArticle />} />
    //         <Route path="/blog/:id/edit" element={<Edit />} />
    //         <Route path="/login" element={<Login />} />
    //         <Route path="/blog/:id" element={<Article />} />

    //         <Route path="/register" element={<Register />} />
    //       </Routes>
    //       <Footer />
    //     </div>
    //   </BlogProvider>
    // </UserContextProvider>

    <Spinner />
  );
}

export default App;
