<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'description',
        'price',
        'is_negotiable',
        'location',
        'region',
        'images',
        'status', // pending_review, active, rejected, expired
        'is_promoted',
        'is_vip',
        'featured_until',
        'views_count',
        'contact_phone',
        'contact_email',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_negotiable' => 'boolean',
        'is_promoted' => 'boolean',
        'is_vip' => 'boolean',
        'featured_until' => 'datetime',
        'images' => 'array',
        'views_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeVip(Builder $query): Builder
    {
        return $query->where('is_vip', true)
                     ->where('featured_until', '>=', now());
    }

    public function scopePromoted(Builder $query): Builder
    {
        return $query->where('is_promoted', true)
                     ->where('featured_until', '>=', now());
    }
}
