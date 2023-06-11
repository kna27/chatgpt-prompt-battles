import Header from '../components/header';

export default function SignIn() {
    return (
        <div>
            <Header />
            <h1>Sign In</h1>
            <h2>Sign in with Google</h2>
            <button>
                <a href="http://localhost:3001/auth/google">Sign In with Google</a>
                
            </button>
        </div>
    );
}