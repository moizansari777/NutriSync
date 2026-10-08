/**
 * Identity for the chat turn that is currently on screen.
 *
 * Starting a new chat has to retire work that is already in the air: the send
 * request, the background task holding it, and the socket stream that follows.
 * None of that lives in React, so the marker does not live in Redux either —
 * bumping it is synchronous and costs no render, and every async step captures
 * the generation it belongs to and re-checks it before touching shared state.
 */

type Aborter = () => void;

class ChatSession {
  private generation = 0;
  private aborters: Set<Aborter> = new Set();

  current(): number {
    return this.generation;
  }

  isCurrent(generation: number): boolean {
    return generation === this.generation;
  }

  /**
   * Registers a cancel function for the current turn. Returns an unregister
   * function so a turn that ends normally does not leave its aborter behind.
   */
  onInvalidate(abort: Aborter): () => void {
    this.aborters.add(abort);
    return () => {
      this.aborters.delete(abort);
    };
  }

  /**
   * Retires every in-flight turn and returns the new generation. Aborters are
   * detached before they run, so a cancel path that unregisters itself cannot
   * mutate the set mid-iteration.
   */
  invalidate(): number {
    this.generation += 1;

    const pending = Array.from(this.aborters);
    this.aborters.clear();
    pending.forEach(abort => {
      try {
        abort();
      } catch {
        // A cancel that throws must never block the reset.
      }
    });

    return this.generation;
  }
}

const chatSession = new ChatSession();
export default chatSession;
