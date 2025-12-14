import SearchBar from "@/features/search/search_bar";
import SearchResultsModal from "@/features/search/search_results_modal";
import SearchResultsTable from "@/features/search/search_results_table";
import AppShell from "@/pages/layouts/app_shell";

// TODO:: Since each component is self managed they know when to appear and when to disappear
// TODO :: now i want to create a thing where when they appear they search bar moves up and the modal shows the data or the table shows the data.
// TODO :: if both states that hold modal data and table data are empty then the search bar goes in the middle.

function SearchPage() {
  return (
    <AppShell>
      <div>
        <SearchBar />
      </div>
      <div className="relative z-40">
        <SearchResultsModal />
      </div>
      <div className="w-full h-full">
        <SearchResultsTable />
      </div>
    </AppShell>
  );
}

export default SearchPage;
