// Dashboard Alert Card
const AlertCard = ({ type, message, onResolve }) => {
  const colors = {
    warning: "bg-yellow-900 text-yellow-200 border-yellow-700",
    error: "bg-red-900 text-red-200 border-red-700",
    info: "bg-blue-900 text-blue-200 border-blue-700",
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[type] || colors.info} mb-4 flex justify-between items-center`}>
      <div>
        <div className="font-bold capitalize">{type}</div>
        <div>{message}</div>
      </div>
      {onResolve && (
        <button
          onClick={onResolve}
          className="ml-4 px-3 py-1 bg-white text-red-900 text-xs font-bold uppercase rounded hover:bg-red-50 transition-colors"
        >
          Resolve
        </button>
      )}
    </div>
  );
};

export default AlertCard;
