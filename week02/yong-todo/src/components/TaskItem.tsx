type Props = {
  taskText: string;
  actionLabel: "완료" | "삭제";
  actionVariant: "success" | "danger";
  onClick: () => void;
};

export default function TaskItem({ taskText, actionLabel, actionVariant, onClick }: Props) {
  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{taskText}</span>
      <button
        className={`render-container__item-button ${actionVariant}`}
        onClick={onClick}
      >
        {actionLabel}
      </button>
    </li>
  );
}



