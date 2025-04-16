const SearchInput = ({ value, onChange }) => (
    <input
      type="text"
      placeholder="Пошук фільму..."
      value={value}
      onChange={onChange}
      className="search-input"
    />
  );
  
  export default SearchInput;
  
  