import "./SearchInput.css"

const SearchInput = ({ value, onChange }) => {
   return  <input
      type="text"
      placeholder="Пошук фільму..."
      value={value}
      onChange={onChange}
      className="search-input"
    />
};
  
export default SearchInput;
  
  