import "./SearchInput.css"

const SearchInput = ({ value, onChange }) => {
   return  <input
      type="text"
      placeholder="Search movie..."
      value={value}
      onChange={onChange}
      className="search-input"
    />
};
  
export default SearchInput;
  
  