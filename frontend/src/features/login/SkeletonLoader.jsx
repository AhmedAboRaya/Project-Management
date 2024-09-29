const SkeletonLoader = () => {
    return (
      <div className="flex items-center justify-center h-screen bg-light-bg px-10 sm:px-0">
        <div className="flex flex-col md:flex-row space-x-2 w-full max-w-5xl"> {/* Change to column on mobile */}
          
          {/* Skeleton for the left side form */}
          <div className="flex-1 bg-gray-300 rounded-md animate-pulse p-10 pt-40 flex flex-col items-center justify-center"> 
            <div className="h-10 bg-gray-400 rounded-md mb-4 animate-pulse w-full"></div> {/* Ensure full width */}
            <div className="h-10 bg-gray-400 rounded-md mb-4 animate-pulse w-full"></div> {/* Ensure full width */}
          </div>
  
          {/* Skeleton for the image on the right */}
          <div className="w-1/2 flex flex-col justify-center items-center">
            <div className="h-1/2 w-1/2 bg-gray-300 rounded-md animate-pulse hidden sm:block"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SkeletonLoader;
  
  