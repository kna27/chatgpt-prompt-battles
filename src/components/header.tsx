export default function Header() {
    return (
        <div className="App">
            <header className="App-header">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/browse">Browse Prompts</a></li>
                    <li><a href="/create">Create Prompts</a></li>
                    <li><a href="/signin">Register / Sign In</a></li>
                </ul>
            </header>
        </div>
    );
}
