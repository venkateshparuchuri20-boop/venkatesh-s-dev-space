import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { format, subDays, isSameDay } from "date-fns";
import {
  Plus,
  Check,
  Trash2,
  Clock,
  AlertTriangle,
  LogOut,
  ArrowLeft,
  Target,
} from "lucide-react";

interface DailyTask {
  id: string;
  title: string;
  description: string | null;
  time_spent_minutes: number;
  is_completed: boolean;
  task_date: string;
  created_at: string;
}

interface DailyProgress {
  progress_date: string;
  completed_tasks: number;
  total_tasks: number;
  work_logged: boolean;
}

const Planner = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/auth");
          return;
        }
        setUser(session.user);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchProgress();
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("daily_tasks")
      .select("*")
      .eq("task_date", today)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }
    setTasks((data as DailyTask[]) || []);
    setLoading(false);
  };

  const fetchProgress = async () => {
    const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
    const { data, error } = await supabase
      .from("daily_progress")
      .select("*")
      .gte("progress_date", thirtyDaysAgo)
      .order("progress_date", { ascending: true });

    if (error) {
      console.error("Error fetching progress:", error);
      return;
    }
    setProgress((data as DailyProgress[]) || []);
  };

  const addTask = async () => {
    if (!newTask.trim() || !user) return;

    const { error } = await supabase.from("daily_tasks").insert({
      user_id: user.id,
      title: newTask.trim(),
      task_date: today,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setNewTask("");
    fetchTasks();
    updateProgress();
  };

  const toggleTask = async (task: DailyTask) => {
    const { error } = await supabase
      .from("daily_tasks")
      .update({
        is_completed: !task.is_completed,
        completed_at: !task.is_completed ? new Date().toISOString() : null,
      })
      .eq("id", task.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    fetchTasks();
    updateProgress();
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("daily_tasks").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    fetchTasks();
    updateProgress();
  };

  const updateTimeSpent = async (id: string, minutes: number) => {
    const { error } = await supabase
      .from("daily_tasks")
      .update({ time_spent_minutes: Math.max(0, minutes) })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    fetchTasks();
    updateProgress();
  };

  const updateProgress = async () => {
    if (!user) return;

    const { data: todayTasks } = await supabase
      .from("daily_tasks")
      .select("*")
      .eq("task_date", today);

    const allTasks = (todayTasks as DailyTask[]) || [];
    const completed = allTasks.filter((t) => t.is_completed).length;
    const totalTime = allTasks.reduce((sum, t) => sum + (t.time_spent_minutes || 0), 0);

    const { data: existing } = await supabase
      .from("daily_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("progress_date", today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("daily_progress")
        .update({
          total_tasks: allTasks.length,
          completed_tasks: completed,
          total_time_minutes: totalTime,
          work_logged: allTasks.length > 0,
        })
        .eq("id", (existing as any).id);
    } else {
      await supabase.from("daily_progress").insert({
        user_id: user.id,
        progress_date: today,
        total_tasks: allTasks.length,
        completed_tasks: completed,
        total_time_minutes: totalTime,
        work_logged: allTasks.length > 0,
      });
    }

    fetchProgress();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const incompleteTasks = tasks.filter((t) => !t.is_completed);
  const completedTasks = tasks.filter((t) => t.is_completed);
  const totalTimeToday = tasks.reduce((sum, t) => sum + (t.time_spent_minutes || 0), 0);

  // Check if no work logged today — show warning
  const noWorkToday = tasks.length === 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-display text-xl font-bold text-foreground">Daily Planner</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMM d")}</span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Warning if no work logged */}
        {noWorkToday && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="text-destructive shrink-0" size={24} />
            <div>
              <p className="font-semibold text-foreground">No work logged today!</p>
              <p className="text-sm text-muted-foreground">
                Add your tasks and start tracking. Consistency is key to success! 💪
              </p>
            </div>
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{tasks.length}</p>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{completedTasks.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-accent-foreground">
              {Math.floor(totalTimeToday / 60)}h {totalTimeToday % 60}m
            </p>
            <p className="text-xs text-muted-foreground">Time Spent</p>
          </div>
        </div>

        {/* Add task */}
        <div className="flex gap-2">
          <Input
            placeholder="What do you need to do today?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1"
          />
          <Button onClick={addTask} className="gap-2">
            <Plus size={18} />
            Add
          </Button>
        </div>

        {/* Task list */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Target size={18} />
            Today's Tasks
          </h2>

          {tasks.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">
              No tasks yet. Add your first task above!
            </p>
          )}

          {incompleteTasks.map((task) => (
            <div
              key={task.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleTask(task)}
                className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center shrink-0 hover:bg-primary/10 transition-colors"
              >
              </button>
              <span className="flex-1 text-foreground">{task.title}</span>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted-foreground" />
                <Input
                  type="number"
                  min={0}
                  value={task.time_spent_minutes}
                  onChange={(e) => updateTimeSpent(task.id, parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-xs text-center"
                  placeholder="min"
                />
                <span className="text-xs text-muted-foreground">min</span>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {completedTasks.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-muted-foreground pt-4">
                Completed ({completedTasks.length})
              </h3>
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-card/50 border border-border/50 rounded-lg p-4 flex items-center gap-3 opacity-70"
                >
                  <button
                    onClick={() => toggleTask(task)}
                    className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0"
                  >
                    <Check size={14} className="text-primary-foreground" />
                  </button>
                  <span className="flex-1 text-foreground line-through">{task.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {task.time_spent_minutes}m
                  </span>
                  <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Consistency tracker — dot grid for last 30 days */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-foreground">
            30-Day Consistency
          </h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const date = subDays(new Date(), 29 - i);
                const dateStr = format(date, "yyyy-MM-dd");
                const dayProgress = progress.find((p) => p.progress_date === dateStr);
                const isToday = isSameDay(date, new Date());
                const hasWork = dayProgress?.work_logged;
                const allDone =
                  dayProgress && dayProgress.total_tasks > 0 && dayProgress.completed_tasks === dayProgress.total_tasks;

                let dotColor = "bg-muted";
                if (allDone) dotColor = "bg-green-500";
                else if (hasWork) dotColor = "bg-primary";

                return (
                  <div
                    key={dateStr}
                    title={`${format(date, "MMM d")} — ${
                      hasWork ? `${dayProgress?.completed_tasks}/${dayProgress?.total_tasks} tasks` : "No work"
                    }`}
                    className={`w-6 h-6 rounded-md ${dotColor} ${
                      isToday ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                    } transition-colors cursor-default`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-muted" /> No work
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary" /> In progress
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500" /> All done
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
