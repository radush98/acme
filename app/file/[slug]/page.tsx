import { FilePreview } from "@/components/main/filePreview/FilePreview";

type FilePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FilePage({ params }: FilePageProps) {
  const { slug } = await params;

  return <FilePreview fileId={slug} />;
}
