import ProjectListBuilder from "@/components/projects/project-list-builder"
import ProjectListView from "@/components/projects/project-list-view"

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <ProjectListBuilder />
      <ProjectListView />
    </div>
  )
}
