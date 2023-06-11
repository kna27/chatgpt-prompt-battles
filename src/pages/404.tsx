import Header from '../components/header';

export default function PageNotFound() {
    return (
        <div>
            <Header />
            <h1>Error 404: Page Not Found</h1>
            <p>The page you were looking for does not exist.</p>
            <a href="/">Return to Home</a>
        </div>
    );
}
