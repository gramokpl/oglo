<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->decimal('price', 10, 2);
            $table->boolean('is_negotiable')->default(false);
            $table->string('location');
            $table->string('region')->default('Mazowieckie');
            $table->json('images')->nullable();
            $table->enum('status', ['pending_review', 'active', 'rejected', 'expired'])->default('pending_review');
            $table->boolean('is_promoted')->default(false);
            $table->boolean('is_vip')->default(false);
            $table->timestamp('featured_until')->nullable();
            $table->unsignedBigInteger('views_count')->default(0);
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'is_vip', 'created_at']);
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('stripe_payment_id')->nullable();
            $table->decimal('amount', 8, 2);
            $table->string('currency', 3)->default('pln');
            $table->string('tier');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
        Schema::dropIfExists('listings');
    }
};
