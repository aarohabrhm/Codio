import ExplorerItem from "./ExplorerItem";

export default function Explorer({
  files,
  activeFileId,
  onToggle,
  onOpen,
  creating,
  renamingId,
  onStartRename,
  onStartCreate,
  onCommitCreate,
  onCancelCreate,
  onCommitRename,
  onCancelRename,
}) {
  const render = (id, depth = 0) => {
    const node = files[id];
    if (!node) return null;

    const isParentForCreate =
      creating && creating.parentId === id && node.type === "folder";

    return (
      <div key={id}>
        <ExplorerItem
          node={node}
          depth={depth}
          active={activeFileId === id}
          onToggle={onToggle}
          onOpen={onOpen}
          isRenaming={renamingId === id}
          onStartRename={onStartRename}
          onStartCreate={onStartCreate}
          onCommitRename={onCommitRename}
          onCancelRename={onCancelRename}
        />
        {node.isOpen &&
          node.children?.map((c) => render(c, depth + 1))}
        {isParentForCreate && node.isOpen && (
          <ExplorerItem
            node={{ id: "__creating__", name: "", type: creating.type }}
            depth={depth + 1}
            active={false}
            onToggle={() => {}}
            onOpen={() => {}}
            isCreating
            onCommitCreate={(name) =>
              onCommitCreate(node.id, creating.type, name)
            }
            onCancelCreate={onCancelCreate}
          />
        )}
      </div>
    );
  };

  return <div>{render("root")}</div>;
}
