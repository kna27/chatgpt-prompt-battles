import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PageNotFound from "./pages/404";
import BrowsePrompts from "./pages/BrowsePrompts"
import CreatePrompt from "./pages/CreatePrompt"
import PlayPrompt from "./pages/PlayPrompt";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";



export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Index />} />
                <Route path="/browse" element={<BrowsePrompts />} />
                <Route path="/create" element={<CreatePrompt />} />
                <Route path="/play/:id" element={<PlayPrompt />} />
                <Route path="/register" element={<Register />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signout" element={<SignOut />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    )
}