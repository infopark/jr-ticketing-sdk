import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  verticalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as React from "react";
import { Keyable } from "../../utils/types";

export function SortableContainer({
  items,
  ids,
  children,
  onSortEnd,
  disabled,
  useDragHandle,
}) {
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  const sensors = useSensors(mouseSensor, keyboardSensor, touchSensor);

  const [activeId, setActiveId] = React.useState(null);

  const activeElement = React.useMemo(
    () => children.find((child) => child.key === activeId),
    [activeId, children]
  );

  return (
    <div className="sortable_container" style={{ padding: 10 }}>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {ids.map((id) => (
            <SortableItem
              key={id}
              id={id}
              disabled={disabled}
              useDragHandle={useDragHandle}
            >
              {findChildByKey(id)}
            </SortableItem>
          ))}
        </SortableContext>
        <DragOverlay className="scrivito_detail_content_dragging">
          {activeId ? (
            <Item useDragHandle={useDragHandle}>{activeElement}</Item>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function findChildByKey(key) {
    return children.find((child) => child.key === key) || null;
  }

  function onDragStart(event) {
    setActiveId(event.active.id.toString());
  }

  function onDragEnd(event) {
    setActiveId(null);

    if (event.over) {
      const oldIndex = ids.indexOf(event.active.id.toString());
      const newIndex = ids.indexOf(event.over.id.toString());
      const nextOrder = arrayMove(items, oldIndex, newIndex);

      if (onSortEnd) {
        onSortEnd(nextOrder, oldIndex, newIndex);
      }
    }
  }
}

function SortableItem({
  id,
  children,
  disabled = false,
  useDragHandle = false,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled, transition: null });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.1 : undefined,
  };

  return (
    <Item
      ref={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
      useDragHandle={useDragHandle}
    >
      {children}
    </Item>
  );
}

const ItemComponent = (props: Keyable, ref: React.Ref<HTMLDivElement>) => {
  const { attributes, listeners, style, useDragHandle } = props;

  return useDragHandle ? (
    <ItemWithDragHandle ref={ref} {...props} />
  ) : (
    <div style={style} {...attributes} {...listeners} ref={ref}>
      {props.children}
    </div>
  );
};

const Item = React.forwardRef(ItemComponent);

const ItemWithDragHandleComponent = (props: Keyable, ref: React.Ref<HTMLDivElement>) => {
  const { attributes, listeners, style } = props;

  return (
    <div style={style} ref={ref} className="scrivito_drag_handle">
      <div className="scrivito_drag" {...attributes} {...listeners} />
      {props.children}
    </div>
  );
};

const ItemWithDragHandle = React.forwardRef(ItemWithDragHandleComponent);
