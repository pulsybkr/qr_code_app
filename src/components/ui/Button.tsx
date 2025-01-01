interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function Button({ 
  children, 
  isLoading, 
  variant = 'primary', 
  ...props 
}: ButtonProps) {
  const baseStyles = "w-full py-2 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  };

  return (
    <button 
      {...props}
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : children}
    </button>
  );
} 