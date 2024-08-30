import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="flex justify-end gap-4 bg-purple-500 min-w-full">
      <nav>
        <ul className="flex flex-row gap-3 text-sm p-4">
          <li>
            <Link to="/">Airdrop</Link>
          </li>
          <li>
            <Link to="/sign-message">Sign Message</Link>
          </li>
          <li>
            <Link to="/send-tokens">Send Tokens</Link>
          </li>
          <li>
            <Link to="/send-tokens">Token Info</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
