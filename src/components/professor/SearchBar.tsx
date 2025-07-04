import { Input, InputGroup } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <InputGroup startElement={<LuSearch style={{ color: "white" }} />} mb={2}>
    <Input
      color="primary.50"
      placeholder="Search by class name..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </InputGroup>
);

export default SearchBar;
