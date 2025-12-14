// TODO :: this page will view upload compoonents
import InputFile from "@/features/uploads/file_upload";
import AppShell from "@/pages/layouts/app_shell";

function UploadPage() {
  return (
    <>
      <AppShell>
        <InputFile />
      </AppShell>
    </>
  );
}

export default UploadPage;
