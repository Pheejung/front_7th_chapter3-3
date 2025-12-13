import { Button, CardHeader, CardTitle } from "@/shared/ui"
import { usePostsWidget } from "../model/usePostsWidget"

export default function PostsWidgetHeader() {
  const { setShowAddDialog } = usePostsWidget()

  const handleAddPost = () => {
    setShowAddDialog(true)
  }

  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>게시물 관리자</span>
        <Button onClick={handleAddPost}>게시물 추가</Button>
      </CardTitle>
    </CardHeader>
  )
}
